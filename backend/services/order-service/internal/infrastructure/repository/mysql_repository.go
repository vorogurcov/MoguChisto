package repository

import (
	"context"
	"database/sql"
	"fmt"
	"main/services/order-service/internal/domain"
	"main/services/order-service/internal/dto"
	"time"

	"github.com/google/uuid"
)

type mySqlOrderRepository struct {
	db *sql.DB
}

func NewMySqlOrderRepository(db *sql.DB) *mySqlOrderRepository {
	return &mySqlOrderRepository{db: db}
}

func (r *mySqlOrderRepository) GetAllUserOrders(ctx context.Context, userID string) ([]*domain.OrderModel, error) {
	const selectOrdersQuery = `
        SELECT o.order_id, o.user_id, o.type, o.cost, o.status, o.start_date, o.cleaners
        FROM orders o
        WHERE o.user_id = ?
    `

	rows, err := r.db.QueryContext(ctx, selectOrdersQuery, userID)
	if err != nil {
		return nil, fmt.Errorf("query orders: %w", err)
	}
	defer rows.Close()

	orders := make([]*domain.OrderModel, 0)

	for rows.Next() {
		var (
			orderID      string
			dbUserID     string
			orderType    string
			cost         float64
			status       string
			startTimeStr sql.NullString
			cleaners     sql.NullString
		)

		if err := rows.Scan(&orderID, &dbUserID, &orderType, &cost, &status, &startTimeStr, &cleaners); err != nil {
			return nil, fmt.Errorf("scan order: %w", err)
		}

		var startTimeParsed time.Time
		if startTimeStr.Valid {
			if t, parseErr := time.Parse("15:04:05", startTimeStr.String); parseErr == nil {
				startTimeParsed = t
			}
		}

		order := &domain.OrderModel{
			OrderID:   orderID,
			UserID:    dbUserID,
			Type:      orderType,
			Cost:      cost,
			Status:    status,
			StartDate: startTimeParsed,
			Cleaners:  "",
		}
		if cleaners.Valid {
			order.Cleaners = cleaners.String
		}

		orders = append(orders, order)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return orders, nil
}

func (r *mySqlOrderRepository) GetOrderById(ctx context.Context, orderID string) (*domain.OrderModel, error) {
	const q = `
        SELECT o.order_id, o.user_id, o.type, o.cost, o.status, o.start_date, o.cleaners
        FROM orders o
        WHERE o.order_id = ?
        LIMIT 1`

	var (
		id           string
		userID       sql.NullString
		orderType    string
		cost         float64
		status       string
		startTimeStr sql.NullString
		cleaners     sql.NullString
	)

	err := r.db.QueryRowContext(ctx, q, orderID).Scan(&id, &userID, &orderType, &cost, &status, &startTimeStr, &cleaners)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("order not found")
		}
		return nil, fmt.Errorf("get order by id: %w", err)
	}

	var startTimeParsed time.Time
	if startTimeStr.Valid {
		if t, parseErr := time.Parse("15:04:05", startTimeStr.String); parseErr == nil {
			startTimeParsed = t
		}
	}

	var userIDField string
	if userID.Valid == false {
		userIDField = ""
	}

	order := &domain.OrderModel{
		OrderID:   id,
		UserID:    userIDField,
		Type:      orderType,
		Cost:      cost,
		Status:    status,
		StartDate: startTimeParsed,
		Cleaners:  "",
	}
	if cleaners.Valid {
		order.Cleaners = cleaners.String
	}

	return order, nil
}

func (r *mySqlOrderRepository) CreateOrder(ctx context.Context, createOrderDto dto.CreateOrderDto) (*domain.OrderModel, error) {
	var userFieldValue interface{}

	if userID, ok := ctx.Value("userID").(string); ok && userID != "" {
		userFieldValue = userID

	} else {
		userFieldValue = nil
	}

	id := uuid.NewString()

	const insertQ = `
		INSERT INTO orders (order_id, user_id, type, cost, status, start_date, cleaners)
		VALUES (?, ?, ?, ?, 'pending', ?, NULL)
	`

	if _, err := r.db.ExecContext(ctx, insertQ, id, userFieldValue, createOrderDto.Type, createOrderDto.Cost, time.Now()); err != nil {
		return nil, fmt.Errorf("insert order: %w", err)
	}

	order, err := r.GetOrderById(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("select created order: %w", err)
	}

	return order, nil
}
