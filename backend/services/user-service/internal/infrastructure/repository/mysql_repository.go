package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"main/services/user-service/internal/domain"

	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
)

var (
	ErrNotFound   = errors.New("not found")
	ErrConflict   = errors.New("conflict")
	ErrForeignKey = errors.New("foreign key violation")
)

type mySqlUserRepository struct {
	db *sql.DB
}

func NewMySqlUserRepository(db *sql.DB) *mySqlUserRepository {
	return &mySqlUserRepository{db: db}
}

func (r *mySqlUserRepository) CreateUser(ctx context.Context, phoneNumber string) (*domain.UserModel, error) {
	insertQuery := "INSERT INTO users (user_id, phone_number) VALUES (?, ?)"
	id := uuid.NewString()

	_, err := r.db.ExecContext(ctx, insertQuery, id, phoneNumber)
	if err != nil {
		var myErr *mysql.MySQLError
		if errors.As(err, &myErr) && myErr.Number == 1062 {
			selectQuery := "SELECT user_id, phone_number FROM users WHERE phone_number = ? LIMIT 1"
			row := r.db.QueryRowContext(ctx, selectQuery, phoneNumber)

			var existingID, existingPhone string
			if scanErr := row.Scan(&existingID, &existingPhone); scanErr != nil {
				if errors.Is(scanErr, sql.ErrNoRows) {
					return nil, fmt.Errorf("insert duplicate but select returned no rows: %w", err)
				}
				return nil, fmt.Errorf("select existing user after duplicate: %w", scanErr)
			}

			user := &domain.UserModel{
				UserID:      existingID,
				PhoneNumber: &existingPhone,
			}
			return user, nil
		}

		return nil, fmt.Errorf("insert user: %w", err)
	}

	user := &domain.UserModel{
		UserID:      id,
		PhoneNumber: &phoneNumber,
	}
	return user, nil
}

func (r *mySqlUserRepository) GetUserByID(ctx context.Context, userID string) (*domain.UserModel, error) {
	query := `
		SELECT user_id, last_name, birthday_date, phone_number, email, first_name
		FROM users
		WHERE users.user_id = ? LIMIT 1
	`

	row := r.db.QueryRowContext(ctx, query, userID)

	var (
		user          domain.UserModel
		nullLastName  sql.NullString
		nullBirthday  sql.NullTime
		nullPhone     sql.NullString
		nullEmail     sql.NullString
		nullFirstName sql.NullString
	)

	err := row.Scan(
		&user.UserID,
		&nullLastName,
		&nullBirthday,
		&nullPhone,
		&nullEmail,
		&nullFirstName,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("get user by id: %w", err)
	}

	if nullLastName.Valid {
		user.LastName = &nullLastName.String
	}
	if nullFirstName.Valid {
		user.FirstName = &nullFirstName.String
	}
	if nullPhone.Valid {
		user.PhoneNumber = &nullPhone.String
	}
	if nullEmail.Valid {
		user.Email = &nullEmail.String
	}
	if nullBirthday.Valid {
		user.BirthdayDate = &nullBirthday.Time
	}

	return &user, nil
}

//func (r *mySqlUserRepository) UpdateUserByID(ctx context.Context, userID string) (*domain.UserModel, error) {
//
//}
//func (r *mySqlUserRepository) UpdateUserNotifications(ctx context.Context, userID string) (*domain.NotificationsModel, error) {
//
//}
