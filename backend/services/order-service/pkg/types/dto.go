package types

type UpdateOrderDto struct {
	AmocrmLeadId int64  `json:"amocrm_lead_id"`
	Status       string `json:"status,omitempty"` // "pending", "in_progress", "completed"
	Cleaners     string `json:"cleaners,omitempty"`
}
