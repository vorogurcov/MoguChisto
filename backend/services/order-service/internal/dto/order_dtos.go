package dto

type CreateOrderDto struct {
	PhoneNumber string  `json:"phone_number"`
	Type        string  `json:"type"`
	Cost        float64 `json:"cost"`
	Area        int     `json:"area"`
}
