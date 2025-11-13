package domain

import (
	"context"
	"main/services/order-service/internal/dto"
	"main/services/order-service/pkg/types"
	"time"
)

type OrderModel struct {
	OrderID   string    `json:"order_id"`
	UserID    string    `json:"user_id,omitempty"`
	Type      string    `json:"type"`
	Cost      float64   `json:"cost"`
	Area      float64   `json:"area"`
	Status    string    `json:"status"`
	StartDate time.Time `json:"start_date"`
	Cleaners  string    `json:"cleaners"`
}

type OrderService interface {
	GetAllUserOrders(ctx context.Context) ([]*OrderModel, error)
	CreateNewOrder(ctx context.Context, createOrderDto dto.CreateOrderDto) (*OrderModel, error)
	UpdateOrderInfoByLeadId(ctx context.Context, updateOrderDto types.UpdateOrderDto)
}

type OrderRepository interface {
	GetAllUserOrders(ctx context.Context, userID string) ([]*OrderModel, error)
	GetOrderById(ctx context.Context, orderID string) (*OrderModel, error)
	CreateOrder(ctx context.Context, createOrderDto dto.CreateOrderDto) (*OrderModel, error)
	SetLeadIDToOrder(ctx context.Context, amocrmLeadId int64, orderID string) (*OrderModel, error)
	UpdateOrderByLeadId(ctx context.Context, updateOrderDto types.UpdateOrderDto) (*OrderModel, error)
}
