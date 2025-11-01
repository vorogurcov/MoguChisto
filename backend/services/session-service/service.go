package session_service

import (
	"context"
	"database/sql"
	"main/services/session-service/internal/utils"
	"net/http"
	"time"
)

type SessionService struct {
	MySqlDb *sql.DB
}

func (ss *SessionService) CreateSessionAndSetCookie(w http.ResponseWriter, userID string, ttl time.Duration) error {
	token, err := utils.GenerateToken()
	if err != nil {
		return err
	}
	hash := utils.HashToken(token)

	now := time.Now().UTC()
	expires := now.Add(ttl)

	_, err = ss.MySqlDb.Exec(
		`INSERT INTO sessions (session_hash, user_id, issued_at, expires_at)
         VALUES (?, ?, ?, ?)`,
		hash, userID, now, expires,
	)
	if err != nil {
		return err
	}

	c := &http.Cookie{
		Name:     "sessid",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		//Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Expires:  expires,
	}
	http.SetCookie(w, c)
	return nil
}

func (ss *SessionService) HandleLogout(w http.ResponseWriter, r *http.Request) error {
	c, err := r.Cookie("sessid")
	if err == nil {
		_, _ = ss.MySqlDb.Exec(`DELETE FROM sessions WHERE session_hash = ?`, utils.HashToken(c.Value))
		http.SetCookie(w, &http.Cookie{
			Name:     "sessid",
			Value:    "",
			Path:     "/",
			Expires:  time.Unix(0, 0),
			MaxAge:   -1,
			HttpOnly: true,
			Secure:   true,
		})
	}
	w.WriteHeader(http.StatusNoContent)
	return err
}

func (ss *SessionService) GetAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie("sessid")
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		token := c.Value
		hash := utils.HashToken(token)

		var userID string
		var expiresAt time.Time
		err = ss.MySqlDb.QueryRowContext(context.Background(),
			`SELECT user_id, expires_at FROM sessions WHERE session_hash = ?`, hash,
		).Scan(&userID, &expiresAt)

		if err == sql.ErrNoRows || (err == nil && time.Now().After(expiresAt)) {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		if err != nil {
			http.Error(w, "internal", http.StatusInternalServerError)
			return
		}

		ctx := context.WithValue(r.Context(), "userID", userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
