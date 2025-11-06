package http

import (
	"encoding/json"
	"main/services/order-service/internal/dto"
	"main/services/order-service/internal/service"
	"net/http"
)

func NewHandleUserOrders(ordSvc *service.OrderService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		switch r.Method {

		case http.MethodGet:
			orders, err := ordSvc.GetAllUserOrders(r.Context())
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			if err := json.NewEncoder(w).Encode(orders); err != nil {
				http.Error(w, "failed to encode response", http.StatusInternalServerError)
				return
			}

		case http.MethodPost:
			var createOrderDto dto.CreateOrderDto

			decoder := json.NewDecoder(r.Body)
			decoder.DisallowUnknownFields()

			if err := decoder.Decode(&createOrderDto); err != nil {
				http.Error(w, "invalid JSON body: "+err.Error(), http.StatusBadRequest)
				return
			}

			if createOrderDto.Type != "comfort" &&
				createOrderDto.Type != "express" &&
				createOrderDto.Type != "elite" {
				http.Error(w, "invalid order type - only 'comfort', 'express' and 'elite' are supported", http.StatusBadRequest)
				return
			}

			order, err := ordSvc.CreateNewOrder(r.Context(), createOrderDto)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			if err := json.NewEncoder(w).Encode(order); err != nil {
				http.Error(w, "failed to encode response", http.StatusInternalServerError)
				return
			}

		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
	}
}
