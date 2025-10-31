package service

import (
	"context"
	"main/services/user-service/internal/domain"
	"main/services/user-service/internal/dto"
)

type UserService struct {
	UserRepo domain.UserRepository
}

func (s *UserService) SignUp(ctx context.Context, createUserDto dto.CreateUserDto) (*domain.UserModel, error) {
	return s.UserRepo.CreateUser(ctx, createUserDto.PhoneNumber)
}

func (s *UserService) GetUserProfile(ctx context.Context, getUserProfileDto dto.GetUserProfileDto) (*domain.UserModel, error) {
	return s.UserRepo.GetUserByID(ctx, getUserProfileDto.UserID)
}
