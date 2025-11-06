package cmd

import (
	"database/sql"
	http2 "main/services/order-service/internal/infrastructure/http"
	"main/services/order-service/internal/infrastructure/repository"
	"main/services/order-service/internal/service"
	session_service "main/services/session-service"
	"net/http"
)

func NewHandler(db *sql.DB) http.Handler {
	orderRepo := repository.NewMySqlOrderRepository(db)
	orderService := service.OrderService{OrderRepo: orderRepo}
	sessionSvc := session_service.SessionService{MySqlDb: db}

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			sessionSvc.
				GetAuthMiddleware(http2.NewHandleUserOrders(&orderService)).
				ServeHTTP(w, r)

		case http.MethodPost:
			sessionSvc.
				GetUserMiddleware(
					http2.NewHandleUserOrders(&orderService)).ServeHTTP(w, r)

		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	return mux
}
