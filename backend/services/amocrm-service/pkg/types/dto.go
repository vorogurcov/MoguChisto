package types

type NewLeadDto struct {
	Name        string `json:"name"`
	Area        int
	Type        string
	PhoneNumber string
	Cost        float64 `json:"price"`
}

type UpdateContactDto struct {
	ContactID   string
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
}
