package service

import (
	"context"
	"errors"
	"fmt"
	"log"
	amocrm_service "main/services/amocrm-service"
	"main/services/amocrm-service/pkg/types"
	"main/services/order-service/internal/domain"
	"main/services/order-service/internal/dto"
	types2 "main/services/order-service/pkg/types"
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

	amoCrmService, err := amocrm_service.NewAmoCrmService()
	if err == nil {
		newLeadDto := types.NewLeadDto{Name: fmt.Sprintf("Заявка на уборку от %v", createOrderDto.PhoneNumber), Type: createOrderDto.Type, Cost: createOrderDto.Cost, Area: createOrderDto.Area,
			PhoneNumber: createOrderDto.PhoneNumber}

		leadId, crmErr := amoCrmService.SendNewLead(ctx, newLeadDto)
		if crmErr != nil {
			log.Print(crmErr.Error())
		}

		order, err = o.OrderRepo.SetLeadIDToOrder(ctx, leadId, order.OrderID)
		if err != nil {
			return nil, err
		}
	}

	return order, nil
}

func (o *OrderService) UpdateOrderInfoByLeadId(ctx context.Context, updateOrderDto types2.UpdateOrderDto) error {
	_, err := o.OrderRepo.UpdateOrderByLeadId(ctx, updateOrderDto)

	if err != nil {
		return err
	}

	return nil
}
