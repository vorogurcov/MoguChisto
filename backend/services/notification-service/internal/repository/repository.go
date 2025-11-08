package repository

import (
	"context"
	"database/sql"
	"fmt"
	"main/services/notification-service/pkg/types"
)

type notificationRepository struct {
	db *sql.DB
}

func NewNotificationRepository(db *sql.DB) *notificationRepository {
	return &notificationRepository{db: db}
}

func (r *notificationRepository) SaveVerificationCode(ctx context.Context, sendCodeDto types.SendVerificationCodeDto) error {
	query := `
		INSERT INTO verification_codes (phone_number, verification_code, created_at)
		VALUES (?, ?, NOW())
		ON DUPLICATE KEY UPDATE
			verification_code = VALUES(verification_code),
			created_at = NOW()
	`
	_, err := r.db.ExecContext(ctx, query, sendCodeDto.PhoneNumber, sendCodeDto.Code)
	if err != nil {
		return fmt.Errorf("failed to save verification code: %w", err)
	}
	return nil
}

func (r *notificationRepository) GetVerificationCode(ctx context.Context, phoneNumber string) (string, error) {
	var code string
	query := `SELECT verification_code FROM verification_codes WHERE phone_number = ?`
	err := r.db.QueryRowContext(ctx, query, phoneNumber).Scan(&code)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("verification code not found for phone number: %s", phoneNumber)
		}
		return "", fmt.Errorf("failed to get verification code: %w", err)
	}
	return code, nil
}

func (r *notificationRepository) VerifyCode(ctx context.Context, phoneNumber string, code string) (bool, error) {
	var storedCode string
	query := `SELECT verification_code FROM verification_codes WHERE phone_number = ?`
	err := r.db.QueryRowContext(ctx, query, phoneNumber).Scan(&storedCode)
	if err != nil {
		if err == sql.ErrNoRows {
			// Код не найден - считаем, что код неверный
			return false, nil
		}
		return false, fmt.Errorf("failed to get verification code: %w", err)
	}
	return storedCode == code, nil
}
