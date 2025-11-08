package http

import (
	"encoding/json"
	"log"
	notification_service "main/services/notification-service"
	ss "main/services/session-service"
	"main/services/user-service/internal/domain"
	"main/services/user-service/internal/dto"
	"main/services/user-service/internal/service"
	"net/http"
	"time"
)

func NewSignUpHandler(userSvc *service.UserService, sessSvc *ss.SessionService, notifSvc *notification_service.NotificationService) http.HandlerFunc {
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

		// Если код подтверждения не передан, генерируем и отправляем новый
		if createUser.VerificationCode == "" {
			log.Print("Генерируем код подтверждения")
			if err := notifSvc.GenerateVerificationCode(r.Context(), createUser.PhoneNumber); err != nil {
				log.Printf("Ошибка при генерации кода: %v", err)
				http.Error(w, "failed to generate verification code", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			apiAns := domain.SignupAnswer{
				IsVerificationRequired: true,
			}
			json.NewEncoder(w).Encode(apiAns)
			return
		}

		isValid, err := notifSvc.ValidateVerificationCode(r.Context(), createUser.PhoneNumber, createUser.VerificationCode)
		if err != nil {
			log.Printf("Ошибка при валидации кода: %v", err)
			http.Error(w, "failed to validate verification code", http.StatusInternalServerError)
			return
		}

		if !isValid {
			http.Error(w, "invalid verification code", http.StatusBadRequest)
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
