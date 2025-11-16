package converters

import (
	"main/services/amocrm-service/internal/dto"
	amocrm_types "main/services/amocrm-service/internal/types"
	"main/services/amocrm-service/pkg/types"
	"strconv"
)

func ConvertNewLeadDtoToCrmLeadDto(newLeadDto types.NewLeadDto, contactID int64) dto.CrmLeadDto {
	priceInt := int(newLeadDto.Cost)

	var customFields []dto.CustomField

	if newLeadDto.Area > 0 {
		customFields = append(customFields, dto.CustomField{
			FieldID: amocrm_types.AmoAreaFieldID,
			Values: []dto.CustomFieldValue{
				{
					Value: strconv.Itoa(newLeadDto.Area),
				},
			},
		})
	}

	if newLeadDto.Type != "" {
		customFields = append(customFields, dto.CustomField{
			FieldID: amocrm_types.AmoTypeFieldID,
			Values: []dto.CustomFieldValue{
				{
					Value: newLeadDto.Type,
				},
			},
		})
	}

	customFields = append(customFields, dto.CustomField{
		FieldID: amocrm_types.AmoStatusFieldId,
		Values: []dto.CustomFieldValue{
			{
				Value: "pending",
			},
		},
	})

	result := dto.CrmLeadDto{
		Name:               newLeadDto.Name,
		Price:              priceInt,
		CustomFieldsValues: customFields,
	}

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
