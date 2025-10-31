package http

import (
	"encoding/json"
	"main/services/user-service/internal/dto"
	"main/services/user-service/internal/service"
	"net/http"
)

func NewSignUpHandler(userSvc *service.UserService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var createUser dto.CreateUserDto

		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&createUser); err != nil {
			http.Error(w, "invalid JSON body", http.StatusBadRequest)
			return
		}

		user, err := userSvc.SignUp(r.Context(), createUser)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
	}
}

func NewGetUserProfileHandler(userSvc *service.UserService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("SUCCESS!"))
	}
}
