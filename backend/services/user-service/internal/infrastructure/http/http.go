package http

import (
	"encoding/json"
	"log"
	notification_service "main/services/notification-service"
	"main/services/notification-service/pkg/types"
	ss "main/services/session-service"
	"main/services/user-service/internal/domain"
	"main/services/user-service/internal/dto"
	"main/services/user-service/internal/service"
	"net/http"
	"os"
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

		if createUser.PhoneNumber == "" {
			http.Error(w, "phone_number is required", http.StatusBadRequest)
			return
		}

		// TODO: Implement proper verification code check

		testEnv := os.Getenv("TEST_ENV")
		if testEnv == "" {
			log.Print("Отправляем соо в sms-aero")
			notifSvc, _ := notification_service.NewNotificationService()
			codeDto := types.SendVerificationCodeDto{Code: "111111", PhoneNumber: createUser.PhoneNumber}
			notifSvc.SendVerificationCode(r.Context(), codeDto)
		}

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

func NewLogoutHandler(sessSvc *ss.SessionService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := sessSvc.HandleLogout(w, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func NewProfileHandler(userSvc *service.UserService, sessSvc *ss.SessionService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		switch r.Method {
		case http.MethodGet:
			profile, err := userSvc.GetUserProfile(r.Context())
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			json.NewEncoder(w).Encode(profile)

		case http.MethodPatch:
			var profileDto dto.ChangeUserProfileDto
			decoder := json.NewDecoder(r.Body)
			if err := decoder.Decode(&profileDto); err != nil {
				http.Error(w, "invalid JSON body", http.StatusBadRequest)
				return
			}

			profile, err := userSvc.UpdateUserProfile(r.Context(), profileDto)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			json.NewEncoder(w).Encode(profile)

		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
	}
}

func NewProfileNotificationsHandler(userSvc *service.UserService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Только два метода поддерживаем
		switch r.Method {
		case http.MethodGet:
			w.Header().Set("Content-Type", "application/json")

			notif, err := userSvc.GetUserNotificationsSettings(r.Context())
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			if err := json.NewEncoder(w).Encode(notif); err != nil {
				http.Error(w, "failed to encode response", http.StatusInternalServerError)
				return
			}
			return

		case http.MethodPatch:
			var settingsDto dto.ChangeUserNotificationSettingsDto
			decoder := json.NewDecoder(r.Body)
			decoder.DisallowUnknownFields()

			if err := decoder.Decode(&settingsDto); err != nil {
				http.Error(w, "invalid JSON body: "+err.Error(), http.StatusBadRequest)
				return
			}

			if settingsDto.BySms == nil && settingsDto.ByEmail == nil {
				http.Error(w, "nothing to update", http.StatusBadRequest)
				return
			}

			notif, err := userSvc.UpdateUserNotificationsSettings(r.Context(), settingsDto)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			if err := json.NewEncoder(w).Encode(notif); err != nil {
				http.Error(w, "failed to encode response", http.StatusInternalServerError)
				return
			}
			return

		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
	}
}
