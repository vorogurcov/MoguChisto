package domain

import (
	"context"
	"main/services/amocrm-service/pkg/types"
)

type AmoCRMService interface {
	//SendAuthenticationCode(w http.ResponseWriter, authCode string) error
	//ProcessAccessTokens(w http.ResponseWriter, r *http.Request, db *sql.DB) error
	//RefreshAccessTokens(w http.ResponseWriter, r *http.Request, db *sql.DB) error
	//TODO: CRUD Protected Resources from amocrm api
	SendNewLead(ctx context.Context, newLeadDto types.NewLeadDto) (interface{}, error) // TODO: Типизировать response
}
