package dto

type EmbeddedContact struct {
	ID int64 `json:"id"`
}

type EmbeddedContacts struct {
	Contacts []EmbeddedContact `json:"contacts,omitempty"`
}

type CrmLeadDto struct {
	Name               string          `json:"name"`
	Price              int             `json:"price"`
	CustomFieldsValues []CustomField   `json:"custom_fields_values,omitempty"`
	Embedded           EmbeddedContacts `json:"_embedded,omitempty"`
}
