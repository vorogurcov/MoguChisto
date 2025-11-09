package domain

import (
	"context"
	"main/services/user-service/internal/dto"
	"time"
)

type UserModel struct {
	UserID       string     `json:"user_id"`
	LastName     *string    `json:"last_name,omitempty"`
	FirstName    *string    `json:"first_name,omitempty"`
	BirthdayDate *time.Time `json:"birthday_date,omitempty"`
	PhoneNumber  *string    `json:"phone_number,omitempty"`
	Email        *string    `json:"email,omitempty"`
}

type NotificationsModel struct {
	UserID  string `json:"user_id"`
	BySms   bool   `json:"by_sms"`
	ByEmail bool   `json:"by_email"`
}

type SignupAnswer struct {
	IsVerificationRequired bool `json:"is_verification_required"`
}

type UserRepository interface {
	CreateUser(ctx context.Context, phoneNumber string) (*UserModel, error)
	GetUserByID(ctx context.Context, userID string) (*UserModel, error)
	UpdateUserByID(ctx context.Context, userID string, changeUserProfileDto dto.ChangeUserProfileDto) (*UserModel, error)
	UpdateUserNotifications(ctx context.Context, userID string, settingsDto dto.ChangeUserNotificationSettingsDto) (*NotificationsModel, error)
	GetUserNotifications(ctx context.Context, userId string) (*NotificationsModel, error)
}

type UserService interface {
	SignUp(ctx context.Context, createUserDto dto.CreateUserDto) (*UserModel, error)
	ChangeUserProfile(ctx context.Context, userID string, changeUserProfileDto dto.ChangeUserProfileDto) (*UserModel, error)
	GetUserProfile(ctx context.Context) (*UserModel, error)
	ChangeUserNotificationsSettings(ctx context.Context, changeUserNotificationsSettingsDto dto.ChangeUserNotificationSettingsDto) (*NotificationsModel, error)
	GetUserNotificationsSettings(ctx context.Context) (*NotificationsModel, error)
}
