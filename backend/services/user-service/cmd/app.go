package cmd

import (
	"database/sql"
	http2 "main/services/user-service/internal/infrastructure/http"
	"main/services/user-service/internal/infrastructure/repository"
	"main/services/user-service/internal/service"
	"net/http"
)

func NewHandler(db *sql.DB) http.Handler {
	userRepo := repository.NewMySqlUserRepository(db)

	userSvc := &service.UserService{
		UserRepo: userRepo,
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/signup", http2.NewSignUpHandler(userSvc))
	mux.HandleFunc("/profile", http2.NewGetUserProfileHandler(userSvc))

	return mux
}
