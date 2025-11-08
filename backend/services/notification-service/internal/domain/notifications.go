package domain

import (
	"context"
	"main/services/notification-service/pkg/types"
)

type NotificationService interface {
	SendVerificationCode(ctx context.Context, sendCodeDto types.SendVerificationCodeDto) error
	GenerateVerificationCode(ctx context.Context, phoneNumber string) error
	ValidateVerificationCode(ctx context.Context, phoneNumber string, code string) (bool, error)
}
