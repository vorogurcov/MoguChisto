package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"main/services/user-service/internal/domain"

	"github.com/google/uuid"
)

type mySqlUserRepository struct {
	db *sql.DB
}

func NewMySqlUserRepository(db *sql.DB) *mySqlUserRepository {
	return &mySqlUserRepository{db: db}
}

func (r *mySqlUserRepository) CreateUser(ctx context.Context, phoneNumber string) (*domain.UserModel, error) {
	query := "INSERT INTO users (user_id, phone_number) VALUES (?, ?)"
	id := uuid.NewString()
	log.Println(phoneNumber)
	_, err := r.db.ExecContext(ctx, query, id, phoneNumber)
	if err != nil {
		return nil, fmt.Errorf("insert user: %w", err)
	}

	user := &domain.UserModel{
		UserID:      id,
		PhoneNumber: phoneNumber,
	}
	return user, nil
}

func (r *mySqlUserRepository) GetUserByID(ctx context.Context, userID string) (*domain.UserModel, error) {
	query := "SELECT user_id, last_name, birthday_date, phone_number, email, first_name" +
		" FROM users" +
		" WHERE users.user_id = ? LIMIT 1"

	row := r.db.QueryRowContext(ctx, query, userID)

	var user domain.UserModel
	err := row.Scan(
		&user.UserID,
		&user.LastName,
		&user.BirthdayDate,
		&user.PhoneNumber,
		&user.Email,
		&user.FirstName,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("get user by id: %w", err)
	}

	return &user, nil
}

//func (r *mySqlUserRepository) UpdateUserByID(ctx context.Context, userID string) (*domain.UserModel, error) {
//
//}
//func (r *mySqlUserRepository) UpdateUserNotifications(ctx context.Context, userID string) (*domain.NotificationsModel, error) {
//
//}
