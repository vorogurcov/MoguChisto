package repository

import (
	"context"
	"database/sql"
	"fmt"
	"main/services/order-service/internal/domain"
	"main/services/order-service/internal/dto"
	"main/services/order-service/pkg/types"
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
        SELECT o.order_id, o.user_id, o.type, o.cost, o.area, o.status, o.start_date, o.cleaners, o.lead_updated_at
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
			orderID     string
			dbUserID    string
			orderType   string
			cost        float64
			area        sql.NullFloat64
			status      string
			startTime   sql.NullTime
			cleaners    sql.NullString
			leadUpdated sql.NullTime
		)

		if err := rows.Scan(&orderID, &dbUserID, &orderType, &cost, &area, &status, &startTime, &cleaners, &leadUpdated); err != nil {
			return nil, fmt.Errorf("scan order: %w", err)
		}

		order := &domain.OrderModel{
			OrderID:       orderID,
			UserID:        dbUserID,
			Type:          orderType,
			Cost:          cost,
			Area:          0,
			Status:        status,
			StartDate:     time.Time{},
			Cleaners:      "",
			LeadUpdatedAt: nil,
		}
		if area.Valid {
			order.Area = area.Float64
		}
		if cleaners.Valid {
			order.Cleaners = cleaners.String
		}
		if leadUpdated.Valid {
			t := leadUpdated.Time
			order.LeadUpdatedAt = &t
		}
		if startTime.Valid {
			order.StartDate = startTime.Time
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
        SELECT o.order_id, o.user_id, o.type, o.cost, o.area, o.status, o.start_date, o.cleaners, o.lead_updated_at
        FROM orders o
        WHERE o.order_id = ?
        LIMIT 1`

	var (
		id          string
		userID      sql.NullString
		orderType   string
		cost        float64
		area        sql.NullFloat64
		status      string
		startTime   sql.NullTime
		cleaners    sql.NullString
		leadUpdated sql.NullTime
	)

	err := r.db.QueryRowContext(ctx, q, orderID).Scan(&id, &userID, &orderType, &cost, &area, &status, &startTime, &cleaners, &leadUpdated)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("order not found")
		}
		return nil, fmt.Errorf("get order by id: %w", err)
	}

	var userIDField string
	if userID.Valid == false {
		userIDField = ""
	}

	order := &domain.OrderModel{
		OrderID:       id,
		UserID:        userIDField,
		Type:          orderType,
		Cost:          cost,
		Area:          0,
		Status:        status,
		StartDate:     time.Time{},
		Cleaners:      "",
		LeadUpdatedAt: nil,
	}
	if area.Valid {
		order.Area = area.Float64
	}
	if cleaners.Valid {
		order.Cleaners = cleaners.String
	}
	if leadUpdated.Valid {
		t := leadUpdated.Time
		order.LeadUpdatedAt = &t
	}
	if startTime.Valid {
		order.StartDate = startTime.Time
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

	leadUpdatedAt := time.Now().UTC().Add(3 * time.Hour)

	const insertQ = `
		INSERT INTO orders (order_id, user_id, type, cost, phone_number, area, status, start_date, cleaners, lead_updated_at)
		VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, NULL, ?)
	`

	if _, err := r.db.ExecContext(ctx, insertQ, id, userFieldValue, createOrderDto.Type, createOrderDto.Cost, createOrderDto.PhoneNumber, createOrderDto.Area, time.Now(), leadUpdatedAt.UTC()); err != nil {
		return nil, fmt.Errorf("insert order: %w", err)
	}

	order, err := r.GetOrderById(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("select created order: %w", err)
	}

	return order, nil
}

func (r *mySqlOrderRepository) UpdateOrderByLeadId(ctx context.Context, updateOrderDto types.UpdateOrderDto) (*domain.OrderModel, error) {
	if updateOrderDto.AmocrmLeadId == 0 {
		return nil, fmt.Errorf("amocrm_lead_id is empty")
	}

	updateOrderQuery := "UPDATE orders SET status = ?, cleaners = ?, lead_updated_at = ? WHERE amocrm_lead_id = ?"

	var leadUpdated sql.NullTime
	if updateOrderDto.LeadUpdated != nil {
		leadUpdated = sql.NullTime{Time: *updateOrderDto.LeadUpdated, Valid: true}
	}

	_, err := r.db.ExecContext(ctx, updateOrderQuery, updateOrderDto.Status, updateOrderDto.Cleaners, leadUpdated, updateOrderDto.AmocrmLeadId)
	if err != nil {
		return nil, fmt.Errorf("update order: %w", err)
	}

	var orderID string
	const selectIDQ = "SELECT order_id FROM orders WHERE amocrm_lead_id = ? LIMIT 1"
	if err := r.db.QueryRowContext(ctx, selectIDQ, updateOrderDto.AmocrmLeadId).Scan(&orderID); err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("order not found after update")
		}
		return nil, fmt.Errorf("select order id: %w", err)
	}

	order, err := r.GetOrderById(ctx, orderID)
	if err != nil {
		return nil, fmt.Errorf("fetch updated order: %w", err)
	}

	return order, nil
}

func (r *mySqlOrderRepository) SetLeadIDToOrder(ctx context.Context, amocrmLeadId int64, orderID string) (*domain.OrderModel, error) {
	updateOrderQuery := "UPDATE orders SET amocrm_lead_id = ? WHERE order_id = ?"

	res, err := r.db.ExecContext(ctx, updateOrderQuery, amocrmLeadId, orderID)
	if err != nil {
		return nil, fmt.Errorf("update order: %w", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("could not get rows affected after update: %w", err)
	}
	if rowsAffected == 0 {
		return nil, fmt.Errorf("order not found")
	}

	order, err := r.GetOrderById(ctx, orderID)
	if err != nil {
		return nil, fmt.Errorf("fetch updated order: %w", err)
	}

	return order, nil
}
