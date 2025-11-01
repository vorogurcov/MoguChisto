package http

import (
	"encoding/json"
	ss "main/services/session-service"
	"main/services/user-service/internal/domain"
	"main/services/user-service/internal/dto"
	"main/services/user-service/internal/service"
	"net/http"
	"time"
)

func NewSignUpHandler(userSvc *service.UserService, sessSvc *ss.SessionService) http.HandlerFunc {
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
		// TODO: Implement proper verification code check
		if createUser.VerificationCode != "111111" {
			w.Header().Set("Content-Type", "application/json")
			apiAns := domain.SignupAnswer{
				IsVerificationRequired: true,
			}
			json.NewEncoder(w).Encode(apiAns)
			return
		}

		user, err := userSvc.SignUp(r.Context(), createUser)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = sessSvc.CreateSessionAndSetCookie(w, user.UserID, time.Hour*24)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		apiAns := domain.SignupAnswer{
			IsVerificationRequired: false,
		}
		json.NewEncoder(w).Encode(apiAns)
	}
}

func NewGetUserProfileHandler(userSvc *service.UserService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		profile, err := userSvc.GetUserProfile(r.Context())

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(profile)
	}
}

func NewLogoutHandler(userSvc *service.UserService, sessSvc *ss.SessionService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := sessSvc.HandleLogout(w, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
