package amocrm

import (
	"database/sql"
	http2 "main/services/amocrm-service/internal/http"
	"net/http"
)

func NewHandler(db *sql.DB) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/amocrm/webhook", http2.NewAmocrmWebhookHandler(db))

	return mux
}
