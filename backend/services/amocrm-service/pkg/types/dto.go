package types

type NewLeadDto struct {
	Name        string `json:"name"`
	Area        int
	Type        string
	PhoneNumber string
	Cost        float64 `json:"price"`
}
