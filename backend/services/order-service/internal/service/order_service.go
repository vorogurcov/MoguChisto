package service

import (
	"context"
	"errors"
	"fmt"
	"main/services/order-service/internal/domain"
	"main/services/order-service/internal/dto"
)

type OrderService struct {
	OrderRepo domain.OrderRepository
}

func (o *OrderService) GetAllUserOrders(ctx context.Context) ([]*domain.OrderModel, error) {
	userID, ok := ctx.Value("userID").(string)
	if !ok || userID == "" {
		return nil, errors.New("userID not found in context")
	}

	orders, err := o.OrderRepo.GetAllUserOrders(ctx, userID)

	if err != nil {
		return nil, fmt.Errorf("get all user orders error: %w", err)
	}

	return orders, nil
}

func (o *OrderService) CreateNewOrder(ctx context.Context, createOrderDto dto.CreateOrderDto) (*domain.OrderModel, error) {
	order, err := o.OrderRepo.CreateOrder(ctx, createOrderDto)
	if err != nil {
		return nil, fmt.Errorf("create order error: %w", err)
	}

	return order, nil
}
