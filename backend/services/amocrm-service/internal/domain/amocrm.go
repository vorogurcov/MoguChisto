package domain

import (
	"database/sql"
	"net/http"
)

type AmoCRMService interface {
	SendAuthenticationCode(w http.ResponseWriter, authCode string) error
	ProcessAccessTokens(w http.ResponseWriter, r *http.Request, db *sql.DB) error
	RefreshAccessTokens(w http.ResponseWriter, r *http.Request, db *sql.DB) error
	//TODO: CRUD Protected Resources from amocrm api
}
