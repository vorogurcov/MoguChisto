package dto

type CustomFieldValue struct {
	Value    string `json:"value"`
	EnumCode string `json:"enum_code,omitempty"`
}

type CustomField struct {
	FieldID int64              `json:"field_id"`
	Values  []CustomFieldValue `json:"values"`
}

type ContactDto struct {
	ID                 int64         `json:"id,omitempty"`
	FirstName          string        `json:"first_name,omitempty"`
	LastName           string        `json:"last_name,omitempty"`
	Name               string        `json:"name,omitempty"`
	CustomFieldsValues []CustomField `json:"custom_fields_values,omitempty"`
}
