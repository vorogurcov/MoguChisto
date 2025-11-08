package notification_service

import (
	"context"
	"crypto/rand"
	"database/sql"
	"errors"
	"fmt"
	"io"
	"log"
	"main/services/notification-service/internal/repository"
	"main/services/notification-service/pkg/types"
	"math/big"
	"net/http"
	"net/url"
	"os"
)

type NotificationRepository interface {
	SaveVerificationCode(ctx context.Context, sendCodeDto types.SendVerificationCodeDto) error
	VerifyCode(ctx context.Context, phoneNumber string, code string) (bool, error)
}

type NotificationService struct {
	apiKey       string
	apiUrl       string
	accountEmail string
	accountSign  string
	repo         NotificationRepository
}

func NewNotificationService(repo NotificationRepository) (*NotificationService, error) {
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
		repo:         repo,
	}, nil
}

// NewNotificationServiceWithDB создает NotificationService с репозиторием, инициализированным из базы данных
// Эта функция используется для создания сервиса из других сервисов, не импортируя internal пакеты
func NewNotificationServiceWithDB(db *sql.DB) (*NotificationService, error) {
	repo := repository.NewNotificationRepository(db)
	return NewNotificationService(repo)
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

// GenerateVerificationCode генерирует 6-значный код подтверждения, сохраняет его в БД и отправляет SMS
// В тестовом окружении (TEST_ENV != "") всегда генерируется код 111111 без отправки SMS
func (ns *NotificationService) GenerateVerificationCode(ctx context.Context, phoneNumber string) error {
	if ns.repo == nil {
		return errors.New("repository is not initialized")
	}

	var code string
	testEnv := os.Getenv("TEST_ENV")

	// В тестовом окружении используем фиксированный код
	if testEnv != "" {
		code = "111111"
		log.Printf("Тестовое окружение: используем код 111111 для номера %s", phoneNumber)
	} else {
		// В продакшене генерируем случайный код
		var err error
		code, err = generateVerificationCode()
		if err != nil {
			return fmt.Errorf("failed to generate verification code: %w", err)
		}
	}

	sendCodeDto := types.SendVerificationCodeDto{
		PhoneNumber: phoneNumber,
		Code:        code,
	}
	if err := ns.repo.SaveVerificationCode(ctx, sendCodeDto); err != nil {
		return fmt.Errorf("failed to save verification code: %w", err)
	}

	if testEnv == "" {
		if err := ns.SendVerificationCode(ctx, sendCodeDto); err != nil {
			return fmt.Errorf("failed to send verification code: %w", err)
		}
	}

	return nil
}

// ValidateVerificationCode валидирует код подтверждения для указанного номера телефона
func (ns *NotificationService) ValidateVerificationCode(ctx context.Context, phoneNumber string, code string) (bool, error) {
	if ns.repo == nil {
		return false, errors.New("repository is not initialized")
	}

	isValid, err := ns.repo.VerifyCode(ctx, phoneNumber, code)
	if err != nil {
		return false, fmt.Errorf("failed to verify code: %w", err)
	}

	return isValid, nil
}

// generateVerificationCode генерирует случайный 6-значный код
func generateVerificationCode() (string, error) {
	max := big.NewInt(1000000)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}
