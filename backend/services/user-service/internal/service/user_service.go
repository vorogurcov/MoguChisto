package service

import (
	"context"
	"errors"
	"log"
	amocrm_service "main/services/amocrm-service"
	"main/services/amocrm-service/pkg/types"
	"main/services/user-service/internal/domain"
	"main/services/user-service/internal/dto"
	"strconv"
)

type UserService struct {
	UserRepo domain.UserRepository
}

func (s *UserService) SignUp(ctx context.Context, createUserDto dto.CreateUserDto) (*domain.UserModel, error) {

	amocrmService, err := amocrm_service.NewAmoCrmService()
	if err != nil {
		return nil, err
	}

	amocrmContactId, err := amocrmService.CreateContact(ctx, createUserDto.PhoneNumber)

	createUserRepoDto := dto.CreateRepoUserDto{
		PhoneNumber:     createUserDto.PhoneNumber,
		AmoCrmContactId: amocrmContactId,
	}

	return s.UserRepo.CreateUser(ctx, createUserRepoDto)
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

	amocrmService, err := amocrm_service.NewAmoCrmService()
	if err != nil {
		return nil, err
	}
	userModel, err := s.UserRepo.UpdateUserByID(ctx, userID, profileDto)
	if err != nil {
		return nil, err
	}

	log.Println(userModel)
	contact, _ := strconv.ParseInt(*userModel.AmoCrmContactId, 10, 32)
	log.Println(contact)

	updateContact := types.UpdateContactDto{
		ContactID: contact,
		FirstName: *profileDto.FirstName,
		LastName:  *profileDto.LastName,
		Email:     *profileDto.Email,
	}

	_, err = amocrmService.UpdateContact(ctx, updateContact)

	if err != nil {
		return userModel, err
	}
	return userModel, nil
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
