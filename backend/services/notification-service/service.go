package notification_service

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"main/services/notification-service/pkg/types"
	"net/http"
	"net/url"
	"os"
)

type NotificationService struct {
	apiKey       string
	apiUrl       string
	accountEmail string
	accountSign  string
}

func NewNotificationService() (*NotificationService, error) {
	smsAeroApiKey := os.Getenv("SMSAERO_API_KEY")
	if smsAeroApiKey == "" {
		return nil, errors.New("smsAero api key is not set in env")
	}

	smsAeroAccountEmail := os.Getenv("SMSAERO_ACCOUNT_EMAIL")
	if smsAeroAccountEmail == "" {
		return nil, errors.New("accountEmail is not set in env")
	}

	smsAeroAccountSign := os.Getenv("SMSAERO_ACCOUNT_SIGN")
	if smsAeroAccountSign == "" {
		smsAeroAccountSign = "SMS Aero"
	}
	return &NotificationService{
		apiKey:       smsAeroApiKey,
		apiUrl:       "https://gate.smsaero.ru/v2",
		accountEmail: smsAeroAccountEmail,
		accountSign:  smsAeroAccountSign,
	}, nil
}

func (ns NotificationService) SendVerificationCode(ctx context.Context, sendCodeDto types.SendVerificationCodeDto) error {
	smsText := fmt.Sprintf("Ваш код для подтверждения номера в moguchisto.ru: %s.", sendCodeDto.Code)

	params := url.Values{}
	params.Add("number", sendCodeDto.PhoneNumber)
	params.Add("text", smsText)
	params.Add("sign", ns.accountSign)

	reqURL := fmt.Sprintf("https://gate.smsaero.ru/v2/sms/send?%s", params.Encode())
	req, err := http.NewRequestWithContext(ctx, "GET", reqURL, nil)
	if err != nil {
		return fmt.Errorf("ошибка создания запроса: %w", err)
	}

	req.SetBasicAuth(ns.accountEmail, ns.apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("ошибка отправки запроса: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("ошибка от SMSAero: %s", string(body))
	}

	log.Printf("SMS отправлено успешно: %s", string(body))
	return nil
}
