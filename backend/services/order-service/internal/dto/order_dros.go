package dto

type CreateOrderDto struct {
	Type string  `json:"type"`
	Cost float64 `json:"cost"`
}
