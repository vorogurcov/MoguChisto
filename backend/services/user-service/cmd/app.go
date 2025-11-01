package cmd

import (
	"database/sql"
	session_service "main/services/session-service"
	http2 "main/services/user-service/internal/infrastructure/http"
	"main/services/user-service/internal/infrastructure/repository"
	"main/services/user-service/internal/service"
	"net/http"
)

func NewHandler(db *sql.DB) http.Handler {
	userRepo := repository.NewMySqlUserRepository(db)
	sessionSvc := session_service.SessionService{MySqlDb: db}
	userSvc := &service.UserService{
		UserRepo: userRepo,
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/signup", http2.NewSignUpHandler(userSvc, &sessionSvc))
	mux.HandleFunc("/profile", func(w http.ResponseWriter, r *http.Request) {
		sessionSvc.GetAuthMiddleware(http2.NewProfileHandler(userSvc, &sessionSvc)).ServeHTTP(w, r)
	})
	mux.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		sessionSvc.GetAuthMiddleware(http2.NewLogoutHandler(&sessionSvc)).ServeHTTP(w, r)
	})
	mux.HandleFunc("/notifications", func(w http.ResponseWriter, r *http.Request) {
		sessionSvc.GetAuthMiddleware(http2.NewProfileNotificationsHandler(userSvc)).ServeHTTP(w, r)
	})
	return mux
}
