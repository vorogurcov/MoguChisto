package order_service

import (
	"context"
	"main/services/order-service/internal/domain"
	"main/services/order-service/pkg/types"
)

func UpdateOrderInfoByLeadId(ctx context.Context, updateOrderDto types.UpdateOrderDto, orderRepo domain.OrderRepository) error {
	_, err := orderRepo.UpdateOrderByLeadId(ctx, updateOrderDto)

	if err != nil {
		return err
	}

	return nil
}
