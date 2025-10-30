package domain

import (
	"context"
	"main/services/user-service/internal/dto"
)

type UserModel struct {
	UserId       string `json:"user_id"`
	LastName     string `json:"last_name"`
	FirstName    string `json:"first_name"`
	BirthdayDate string `json:"birthday_date"`
	PhoneNumber  string `json:"phone_number"`
	Email        string `json:"email"`
}

type NotificationsModel struct {
	UserId  string `json:"user_id"`
	BySms   bool   `json:"by_sms"`
	ByEmail bool   `json:"by_email"`
}

type UserRepository interface {
	CreateUser(ctx context.Context, phoneNumber string) (*UserModel, error)
	GetUserByID(ctx context.Context, userID string) (*UserModel, error)
	UpdateUserByID(ctx context.Context, userID string) (*UserModel, error)
	UpdateUserNotifications(ctx context.Context, userID string) (*NotificationsModel, error)
}

type UserService interface {
	SignUp(ctx context.Context, createUserDto dto.CreateUserDto) (*UserModel, error)
	ChangeUserProfile(ctx context.Context, changeUserProfileDto dto.ChangeUserProfileDto) (*UserModel, error)
	GetUserProfile(ctx context.Context, getUserProfileDto dto.GetUserProfileDto) (*UserModel, error)
	ChangeUserNotificationsSettings(ctx context.Context, changeUserNotificationsSettingsDto dto.ChangeUserNotificationSettingsDto) (*NotificationsModel, error)
}
