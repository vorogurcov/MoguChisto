package domain

import (
	"context"
	"main/services/order-service/internall/dto"
	"time"
)

type OrderModel struct {
	OrderID   string    `json:"order_id"`
	UserID    string    `json:"user_id"`
	Type      string    `json:"type"`
	Cost      float64   `json:"cost"`
	Status    string    `json:"status"`
	StartDate time.Time `json:"start_date"`
	Cleaners  string    `json:"cleaners"`
}

type OrderService interface {
	GetOrderById(ctx context.Context, orderID string) (*OrderModel, error)
	CreateNewOrder(ctx context.Context, createOrderDto dto.CreateOrderDto)
}

type OrderRepository interface {
	GetAllUserOrders(ctx context.Context) ([]*OrderModel, error)
	GetOrderById(ctx context.Context, orderID string) (*OrderModel, error)
	CreateOrder(ctx context.Context, createOrderDto dto.CreateOrderDto) (*OrderModel, error)
}
