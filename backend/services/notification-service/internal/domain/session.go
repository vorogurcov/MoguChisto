package domain

import (
	"database/sql"
	"net/http"
	"time"
)

type NotificationService interface {
	CreateSessionAndSetCookie(w http.ResponseWriter, db *sql.DB, userID string, ttl time.Duration) error
	HandleLogout(w http.ResponseWriter, r *http.Request, db *sql.DB) error
	GetAuthMiddleware(db *sql.DB, next http.Handler) http.Handler
}
