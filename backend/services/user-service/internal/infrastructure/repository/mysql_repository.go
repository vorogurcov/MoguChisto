package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"main/services/user-service/internal/domain"
	"main/services/user-service/internal/dto"
	"strings"
	"time"

	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
)

type mySqlUserRepository struct {
	db *sql.DB
}

func NewMySqlUserRepository(db *sql.DB) *mySqlUserRepository {
	return &mySqlUserRepository{db: db}
}

func (r *mySqlUserRepository) CreateUser(ctx context.Context, userDto dto.CreateRepoUserDto) (*domain.UserModel, error) {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("begin tx: %w", err)
	}
	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		}
	}()

	id := uuid.NewString()

	// Вставка нового пользователя
	insertUserQuery := "INSERT INTO users (user_id, amocrm_contact_id, phone_number) VALUES (?, ?, ?)"
	_, err = tx.ExecContext(ctx, insertUserQuery, id, userDto.AmoCrmContactId, userDto.PhoneNumber)
	if err != nil {
		var myErr *mysql.MySQLError
		if errors.As(err, &myErr) && myErr.Number == 1062 {
			// Дубликат по phone_number
			selectQuery := "SELECT user_id, phone_number FROM users WHERE phone_number = ? LIMIT 1"
			row := r.db.QueryRowContext(ctx, selectQuery, userDto.PhoneNumber)

			var existingID, existingPhone string
			scanErr := row.Scan(&existingID, &existingPhone)
			if scanErr != nil {
				tx.Rollback()
				if errors.Is(scanErr, sql.ErrNoRows) {
					return nil, fmt.Errorf("insert duplicate but select returned no rows: %w", err)
				}
				return nil, fmt.Errorf("select existing user after duplicate: %w", scanErr)
			}

			// Обновляем заказы для существующего пользователя
			updateOrdersQuery := "UPDATE orders SET user_id = ? WHERE phone_number = ?"
			_, err = tx.ExecContext(ctx, updateOrdersQuery, existingID, userDto.PhoneNumber)
			if err != nil {
				tx.Rollback()
				return nil, fmt.Errorf("ошибка обновления user_id в orders: %w", err)
			}

			if err = tx.Commit(); err != nil {
				return nil, fmt.Errorf("commit tx after duplicate handling: %w", err)
			}

			return &domain.UserModel{
				UserID:      existingID,
				PhoneNumber: &existingPhone,
			}, nil
		}

		tx.Rollback()
		return nil, fmt.Errorf("insert user: %w", err)
	}

	// Создаём запись в notifications
	insertNotifQuery := "INSERT INTO notifications (user_id, by_sms, by_email) VALUES (?, ?, ?)"
	_, err = tx.ExecContext(ctx, insertNotifQuery, id, true, false)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("insert notifications for new user: %w", err)
	}

	// **Привязываем все существующие заказы с этим телефоном к новому user_id**
	updateOrdersQuery := "UPDATE orders SET user_id = ? WHERE phone_number = ?"
	_, err = tx.ExecContext(ctx, updateOrdersQuery, id, userDto.PhoneNumber)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("не удалось привязать существующие заказы к новому пользователю: %w", err)
	}

	if err = tx.Commit(); err != nil {
		return nil, fmt.Errorf("commit tx: %w", err)
	}

	return &domain.UserModel{
		UserID:      id,
		PhoneNumber: &userDto.PhoneNumber,
	}, nil
}

func (r *mySqlUserRepository) GetUserByID(ctx context.Context, userID string) (*domain.UserModel, error) {
	query := `
		SELECT user_id, amocrm_contact_id, last_name, birthday_date, phone_number, email, first_name
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
		contactId     sql.NullString
	)

	err := row.Scan(
		&user.UserID,
		&contactId,
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
	if contactId.Valid {
		user.AmoCrmContactId = &contactId.String
	}

	return &user, nil
}

func (r *mySqlUserRepository) UpdateUserByID(ctx context.Context, userID string, changeUserProfileDto dto.ChangeUserProfileDto) (*domain.UserModel, error) {
	query := "UPDATE users SET "
	args := make([]interface{}, 0)
	setClauses := make([]string, 0)

	if changeUserProfileDto.FirstName != nil {
		setClauses = append(setClauses, "first_name = ?")
		args = append(args, *changeUserProfileDto.FirstName)
	}
	if changeUserProfileDto.LastName != nil {
		setClauses = append(setClauses, "last_name = ?")
		args = append(args, *changeUserProfileDto.LastName)
	}
	if changeUserProfileDto.Email != nil {
		setClauses = append(setClauses, "email = ?")

		emailValue := sql.NullString{
			String: *changeUserProfileDto.Email,
			Valid:  *changeUserProfileDto.Email != "",
		}

		args = append(args, emailValue)
	}
	if changeUserProfileDto.PhoneNumber != nil {
		setClauses = append(setClauses, "phone_number = ?")
		args = append(args, *changeUserProfileDto.PhoneNumber)
	}
	if changeUserProfileDto.BirthdayDate != nil {
		setClauses = append(setClauses, "birthday_date = ?")

		var nt sql.NullTime
		if *changeUserProfileDto.BirthdayDate != "" {
			// Проверяем и парсим дату формата YYYY-MM-DD
			t, _ := time.Parse("2006-01-02", *changeUserProfileDto.BirthdayDate)
			nt = sql.NullTime{Time: t, Valid: true} // Дата валидна
		} else {
			nt = sql.NullTime{Valid: false} // NULL в базе
		}

		args = append(args, nt)
	}

	if len(setClauses) == 0 {
		return nil, fmt.Errorf("no fields to update")
	}

	query += strings.Join(setClauses, ", ")
	query += " WHERE user_id = ?"
	args = append(args, userID)

	result, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("update user: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("rows affected: %w", rowsAffected)
	}

	return r.GetUserByID(ctx, userID)
}
func (r *mySqlUserRepository) GetUserNotifications(ctx context.Context, userID string) (*domain.NotificationsModel, error) {
	const query = "SELECT user_id, by_sms, by_email FROM notifications WHERE user_id = ?"

	var notif domain.NotificationsModel
	row := r.db.QueryRowContext(ctx, query, userID)
	if err := row.Scan(&notif.UserID, &notif.BySms, &notif.ByEmail); err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("notifications not found for user_id %s: %w", userID, err)
		}
		return nil, fmt.Errorf("select notifications: %w", err)
	}

	return &notif, nil
}

func (r *mySqlUserRepository) UpdateUserNotifications(ctx context.Context, userID string, settingsDto dto.ChangeUserNotificationSettingsDto) (*domain.NotificationsModel, error) {
	setClauses := make([]string, 0)
	args := make([]interface{}, 0)

	if settingsDto.BySms != nil {
		setClauses = append(setClauses, "by_sms = ?")
		args = append(args, *settingsDto.BySms)
	}
	if settingsDto.ByEmail != nil {
		setClauses = append(setClauses, "by_email = ?")
		args = append(args, *settingsDto.ByEmail)
	}

	if len(setClauses) == 0 {
		return nil, fmt.Errorf("no fields to update")
	}

	query := "UPDATE notifications SET " + strings.Join(setClauses, ", ") + " WHERE user_id = ?"
	args = append(args, userID)

	res, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("update notifications: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("rows affected: %w", err)
	}
	if rows == 0 {
		notif, getErr := r.GetUserNotifications(ctx, userID)
		if getErr != nil {
			return nil, fmt.Errorf("notifications not found for user_id %s", userID)
		}
		return notif, nil
	}

	notif, err := r.GetUserNotifications(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get after update: %w", err)
	}

	return notif, nil
}
