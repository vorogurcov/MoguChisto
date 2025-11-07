package amocrm_service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"main/services/amocrm-service/internal/converters"
	"main/services/amocrm-service/internal/dto"
	amocrm_types "main/services/amocrm-service/internal/types"
	"main/services/amocrm-service/pkg/types"
	"net/http"
	"os"
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

func (amoSvc *AmoCrmService) createContact(ctx context.Context, phoneNumber string) (int64, error) {
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

func (amoSvc *AmoCrmService) SendNewLead(ctx context.Context, newLeadDto types.NewLeadDto) (interface{}, error) {
	var contactID int64
	var err error
	//TODO: Связывать лид с существующим контактом, посредством первоначального поиска
	// контакта с таким же номером телефона как в заявке
	if newLeadDto.PhoneNumber != "" {
		contactID, err = amoSvc.createContact(ctx, newLeadDto.PhoneNumber)
		if err != nil {
			return nil, fmt.Errorf("ошибка создания контакта: %w", err)
		}
	}

	crmLeadDto := converters.ConvertNewLeadDtoToCrmLeadDto(newLeadDto, contactID)

	body, err := json.Marshal([]dto.CrmLeadDto{crmLeadDto})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", amoSvc.apiUrl+"leads", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", amoSvc.apiKey))
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var parsed map[string]interface{}
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return string(respBody), nil
	}

	return parsed, nil
}
