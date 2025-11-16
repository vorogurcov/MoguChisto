package amocrm_service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"main/services/amocrm-service/internal/converters"
	"main/services/amocrm-service/internal/dto"
	amocrm_types "main/services/amocrm-service/internal/types"
	"main/services/amocrm-service/pkg/types"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

type AmoCrmService struct {
	apiKey string
	apiUrl string
}

func NewAmoCrmService() (*AmoCrmService, error) {
	amoCrmSubdomain := os.Getenv("AMOCRM_SUBDOMAIN")
	if amoCrmSubdomain == "" {
		return nil, errors.New("amocrm subdomain is not set in env")
	}

	amoCrmApiKey := os.Getenv("AMOCRM_ACCESS_KEY")
	if amoCrmApiKey == "" {
		return nil, errors.New("amocrm api key is not set in env")
	}
	return &AmoCrmService{
		apiKey: amoCrmApiKey,
		apiUrl: fmt.Sprintf("https://%v.amocrm.ru/api/v4/", amoCrmSubdomain),
	}, nil
}

func (amoSvc *AmoCrmService) CreateContact(ctx context.Context, phoneNumber string) (int64, error) {

	contactId, err := amoSvc.findContact(ctx, phoneNumber)

	if err == nil {
		return contactId, nil
	}

	contactDto := dto.ContactDto{
		CustomFieldsValues: []dto.CustomField{
			{
				FieldID: amocrm_types.AmoPhoneFieldID,
				Values: []dto.CustomFieldValue{
					{
						Value:    phoneNumber,
						EnumCode: "MOB",
					},
				},
			},
		},
	}

	body, err := json.Marshal([]dto.ContactDto{contactDto})
	if err != nil {
		return 0, err
	}

	req, err := http.NewRequest("POST", amoSvc.apiUrl+"contacts", bytes.NewBuffer(body))
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", amoSvc.apiKey))
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("ошибка создания контакта: %s", string(respBody))
	}

	var contactResponse map[string]interface{}
	if err := json.Unmarshal(respBody, &contactResponse); err != nil {
		return 0, fmt.Errorf("ошибка парсинга ответа создания контакта: %w", err)
	}

	embedded, ok := contactResponse["_embedded"].(map[string]interface{})
	if !ok {
		return 0, fmt.Errorf("не удалось получить _embedded из ответа")
	}

	contacts, ok := embedded["contacts"].([]interface{})
	if !ok || len(contacts) == 0 {
		return 0, fmt.Errorf("не удалось получить контакты из ответа")
	}

	firstContact, ok := contacts[0].(map[string]interface{})
	if !ok {
		return 0, fmt.Errorf("не удалось получить первый контакт из ответа")
	}

	idFloat, ok := firstContact["id"].(float64)
	if !ok {
		return 0, fmt.Errorf("не удалось получить ID контакта из ответа")
	}

	return int64(idFloat), nil
}

func (amoSvc *AmoCrmService) UpdateContact(ctx context.Context, updateContactDto types.UpdateContactDto) (interface{}, error) {
	contactDto := dto.ContactDto{
		ID:        updateContactDto.ContactID,
		FirstName: updateContactDto.FirstName,
		LastName:  updateContactDto.LastName,
		Name:      updateContactDto.FirstName + " " + updateContactDto.LastName,
		CustomFieldsValues: []dto.CustomField{
			{
				FieldID: amocrm_types.AmoPhoneFieldID,
				Values: []dto.CustomFieldValue{
					{
						Value:    updateContactDto.PhoneNumber,
						EnumCode: "MOB",
					},
				},
			},
			{
				FieldID: amocrm_types.AmoEmailFieldID,
				Values: []dto.CustomFieldValue{
					{
						Value:    updateContactDto.Email,
						EnumCode: "PRIV",
					},
				},
			},
		},
	}

	body, err := json.Marshal(contactDto)
	if err != nil {
		return 0, err
	}

	req, err := http.NewRequest("PATCH", amoSvc.apiUrl+fmt.Sprintf("contacts/%v", updateContactDto.ContactID), bytes.NewBuffer(body))
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", amoSvc.apiKey))
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		log.Println(string(respBody))

		return 0, fmt.Errorf("ошибка изменения контакта: %s", string(respBody))
	}

	var contactResponse map[string]interface{}
	if err := json.Unmarshal(respBody, &contactResponse); err != nil {
		return 0, fmt.Errorf("ошибка парсинга ответа изменения контакта: %w", err)
	}

	idFloat, ok := contactResponse["id"].(float64)
	if !ok {
		return 0, fmt.Errorf("не удалось получить ID контакта из ответа")
	}

	return int64(idFloat), nil
}

func (amoSvc *AmoCrmService) findContact(ctx context.Context, phoneNumber string) (int64, error) {
	values := url.Values{}
	values.Set("query", phoneNumber)
	values.Set("limit", "1")

	endpoint := fmt.Sprintf("%scontacts?%s", strings.TrimRight(amoSvc.apiUrl, "/")+"/", values.Encode())

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return 0, fmt.Errorf("ошибка создания запроса: %w", err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", amoSvc.apiKey))
	req.Header.Set("Accept", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return 0, fmt.Errorf("ошибка выполнения запроса: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("ошибка получения контактов: status=%d body=%s", resp.StatusCode, string(bodyBytes))
	}

	var parsed map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &parsed); err != nil {
		return 0, fmt.Errorf("ошибка парсинга ответа: %w (body=%s)", err, string(bodyBytes))
	}

	embedded, ok := parsed["_embedded"].(map[string]interface{})
	if !ok {
		return 0, fmt.Errorf("в ответе отсутствует _embedded")
	}

	items, ok := embedded["contacts"].([]interface{})
	if !ok {
		return 0, fmt.Errorf("в ответе отсутствует _embedded.items")
	}
	if len(items) == 0 {
		return 0, fmt.Errorf("контакт не найден")
	}

	first, ok := items[0].(map[string]interface{})
	if !ok {
		return 0, fmt.Errorf("не удалось разобрать первую сущность контакта")
	}

	idVal, ok := first["id"]
	if !ok {
		return 0, fmt.Errorf("в контакте отсутствует поле id")
	}

	switch v := idVal.(type) {
	case float64:
		return int64(v), nil
	case int64:
		return v, nil
	case int:
		return int64(v), nil
	default:
		return 0, fmt.Errorf("неожиданный тип id: %T", idVal)
	}
}

func (amoSvc *AmoCrmService) SendNewLead(ctx context.Context, newLeadDto types.NewLeadDto) (int64, error) {
	var contactID int64
	var err error

	if newLeadDto.PhoneNumber != "" {

		contactID, err = amoSvc.findContact(ctx, newLeadDto.PhoneNumber)
		log.Println(contactID)
		if err != nil {
			log.Print(err)
			contactID, err = amoSvc.CreateContact(ctx, newLeadDto.PhoneNumber)
			if err != nil {
				return 0, fmt.Errorf("ошибка создания контакта: %w", err)
			}
		}
	}

	crmLeadDto := converters.ConvertNewLeadDtoToCrmLeadDto(newLeadDto, contactID)

	body, err := json.Marshal([]dto.CrmLeadDto{crmLeadDto})
	if err != nil {
		return 0, err
	}

	req, err := http.NewRequest("POST", amoSvc.apiUrl+"leads", bytes.NewBuffer(body))
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", amoSvc.apiKey))
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	var parsed map[string]interface{}
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return 0, err
	}

	_embedded, ok := parsed["_embedded"].(map[string]interface{})
	if !ok {
		return 0, fmt.Errorf("_embedded not found or invalid")
	}

	leads, ok := _embedded["leads"].([]interface{})
	if !ok || len(leads) == 0 {
		return 0, fmt.Errorf("leads not found or empty")
	}

	firstLead, ok := leads[0].(map[string]interface{})
	if !ok {
		return 0, fmt.Errorf("lead item invalid")
	}

	idFloat, ok := firstLead["id"].(float64)
	if !ok {
		return 0, fmt.Errorf("id not found or not a number")
	}

	// Если нужен int64
	id := int64(idFloat)

	return id, nil
}
