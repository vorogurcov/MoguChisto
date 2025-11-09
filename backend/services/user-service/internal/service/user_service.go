package service

import (
	"context"
	"errors"
	"main/services/user-service/internal/domain"
	"main/services/user-service/internal/dto"
)

type UserService struct {
	UserRepo domain.UserRepository
}

func (s *UserService) SignUp(ctx context.Context, createUserDto dto.CreateUserDto) (*domain.UserModel, error) {
	return s.UserRepo.CreateUser(ctx, createUserDto.PhoneNumber)
}

func (s *UserService) GetUserProfile(ctx context.Context) (*domain.UserModel, error) {
	userID, ok := ctx.Value("userID").(string)
	if !ok || userID == "" {
		return nil, errors.New("userID not found in context")
	}

	return s.UserRepo.GetUserByID(ctx, userID)
}

func (s *UserService) UpdateUserProfile(ctx context.Context, profileDto dto.ChangeUserProfileDto) (*domain.UserModel, error) {
	userID, ok := ctx.Value("userID").(string)
	if !ok || userID == "" {
		return nil, errors.New("userID not found in context")
	}

	return s.UserRepo.UpdateUserByID(ctx, userID, profileDto)
}

func (s *UserService) UpdateUserNotificationsSettings(ctx context.Context, settingsDto dto.ChangeUserNotificationSettingsDto) (*domain.NotificationsModel, error) {
	userID, ok := ctx.Value("userID").(string)
	if !ok || userID == "" {
		return nil, errors.New("userID not found in context")
	}

	return s.UserRepo.UpdateUserNotifications(ctx, userID, settingsDto)
}

func (s *UserService) GetUserNotificationsSettings(ctx context.Context) (*domain.NotificationsModel, error) {
	userID, ok := ctx.Value("userID").(string)
	if !ok || userID == "" {
		return nil, errors.New("userID not found in context")
	}

	return s.UserRepo.GetUserNotifications(ctx, userID)
}
