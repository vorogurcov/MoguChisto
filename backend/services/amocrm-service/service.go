package amocrm_service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
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

func (amoSvc *AmoCrmService) SendNewLead(ctx context.Context, newLeadDto types.NewLeadDto) (interface{}, error) {
	body, err := json.Marshal([]types.NewLeadDto{newLeadDto})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", amoSvc.apiUrl+"leads", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %v", amoSvc.apiKey))
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
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
