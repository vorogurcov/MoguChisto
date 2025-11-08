package domain

import (
	"context"
	"main/services/notification-service/pkg/types"
)

type NotificationService interface {
	SendVerificationCode(ctx context.Context, sendCodeDto types.SendVerificationCodeDto)
}
