package repository

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/google/uuid"
	"main/services/user-service/internal/domain"
	"main/shared/db"
)

type mySqlUserRepository struct {
	db *sql.DB
}

func NewMySqlUserRepository(db *sql.DB) *mySqlUserRepository {
	return &mySqlUserRepository{db: db}
}

func (r *mySqlUserRepository) CreateUser(ctx context.Context, phoneNumber string) (*domain.UserModel, error) {
	createUserQuery := fmt.Sprintf("INSERT INTO %v (%v, %v) VALUES (%v,%v)",
		db.UsersCollection, "user_id", "phone_number")
}

func (r *mySqlUserRepository) GetUserByID(ctx context.Context, userID string) (*domain.UserModel, error) {

}

func (r *mySqlUserRepository) UpdateUserByID(ctx context.Context, userID string) (*domain.UserModel, error) {

}
func (r *mySqlUserRepository) UpdateUserNotifications(ctx context.Context, userID string) (*domain.NotificationsModel, error) {

}
