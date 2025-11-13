package dto

type CreateOrderDto struct {
	PhoneNumber string  `json:"phone_number"`
	Type        string  `json:"type"`
	Cost        float64 `json:"cost"`
	Area        int     `json:"area"`
}

type AmocrmWebhookLeadsForm struct {
	Leads struct {
		Update []struct {
			ID           string `json:"id"`
			CustomFields []struct {
				Code   string `json:"code"`
				Name   string `json:"name"`
				Values []struct {
					Value string `json:"value"`
				} `json:"values"`
			} `json:"custom_fields"`
		} `json:"update"`
	} `json:"leads"`
}
