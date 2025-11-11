package domain

import (
	"context"
	"main/services/amocrm-service/pkg/types"
)

//TODO: Сделать webhook с crm на сайт для поддержки возможности смены статуса заказа

type AmoCRMService interface {
	//SendAuthenticationCode(w http.ResponseWriter, authCode string) error
	//ProcessAccessTokens(w http.ResponseWriter, r *http.Request, db *sql.DB) error
	//RefreshAccessTokens(w http.ResponseWriter, r *http.Request, db *sql.DB) error
	//TODO: CRUD Protected Resources from amocrm api
	CreateContact(ctx context.Context, phoneNumber string) (int64, error)
	UpdateContact(ctx context.Context, updateContactDto types.UpdateContactDto) (interface{}, error) // TODO: Типизировать response
	SendNewLead(ctx context.Context, newLeadDto types.NewLeadDto) (interface{}, error)               // TODO: Типизировать response
}
