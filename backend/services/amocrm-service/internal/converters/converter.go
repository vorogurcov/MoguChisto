package converters

import (
	"main/services/amocrm-service/internal/dto"
	"main/services/amocrm-service/pkg/types"
)

func ConvertNewLeadDtoToCrmLeadDto(newLeadDto types.NewLeadDto, contactID int64) dto.CrmLeadDto {
	// Преобразуем стоимость из float64 в int (AmoCRM требует int для price)
	priceInt := int(newLeadDto.Cost)

	var customFields []dto.CustomField

	// Кастомные поля для лида временно отключены, так как нужно создать поля в AmoCRM
	// После создания полей в AmoCRM нужно получить их ID и обновить AmoAreaFieldID и AmoTypeFieldID

	result := dto.CrmLeadDto{
		Name:               newLeadDto.Name,
		Price:              priceInt,
		CustomFieldsValues: customFields,
	}

	// Связываем контакт с лидом через _embedded, если контакт был создан
	if contactID > 0 {
		result.Embedded = dto.EmbeddedContacts{
			Contacts: []dto.EmbeddedContact{
				{
					ID: contactID,
				},
			},
		}
	}

	return result
}
