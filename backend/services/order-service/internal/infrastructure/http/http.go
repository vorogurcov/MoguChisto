package http

import (
	"encoding/json"
	"fmt"
	"log"
	"main/services/order-service/internal/dto"
	"main/services/order-service/internal/service"
	"main/services/order-service/pkg/types"
	"net/http"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

func NewHandleUserOrders(ordSvc *service.OrderService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		switch r.Method {

		case http.MethodGet:
			orders, err := ordSvc.GetAllUserOrders(r.Context())
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			if err := json.NewEncoder(w).Encode(orders); err != nil {
				http.Error(w, "failed to encode response", http.StatusInternalServerError)
				return
			}

		case http.MethodPost:
			var createOrderDto dto.CreateOrderDto

			decoder := json.NewDecoder(r.Body)
			decoder.DisallowUnknownFields()

			if err := decoder.Decode(&createOrderDto); err != nil {
				http.Error(w, "invalid JSON body: "+err.Error(), http.StatusBadRequest)
				return
			}

			if createOrderDto.Type != "comfort" &&
				createOrderDto.Type != "express" &&
				createOrderDto.Type != "elite" {
				http.Error(w, "invalid order type - only 'comfort', 'express' and 'elite' are supported", http.StatusBadRequest)
				return
			}

			order, err := ordSvc.CreateNewOrder(r.Context(), createOrderDto)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			if err := json.NewEncoder(w).Encode(order); err != nil {
				http.Error(w, "failed to encode response", http.StatusInternalServerError)
				return
			}

		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
	}
}

func NewAmocrmWebhookHandler(ordSvc *service.OrderService) http.HandlerFunc {
	// регулярки для парсинга ключей формы
	reCFValue := regexp.MustCompile(`^leads\[update\]\[0\]\[custom_fields\]\[(\d+)\]\[values\]\[(\d+)\]\[value\]$`)
	reCFField := regexp.MustCompile(`^leads\[update\]\[0\]\[custom_fields\]\[(\d+)\]\[(id|name|code)\]$`)

	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// разбор формы
		if err := r.ParseForm(); err != nil {
			http.Error(w, "Failed to parse form", http.StatusBadRequest)
			return
		}

		// --- Извлекаем lead id непосредственно из формы ---
		leadIDStr := r.FormValue("leads[update][0][id]")
		if leadIDStr == "" {
			// если нет id — ничего не делаем
			log.Println("No lead id in form (leads[update][0][id])")
			w.WriteHeader(http.StatusOK)
			return
		}

		// временная структура для сборки custom fields по индексу
		type cfTemp struct {
			ID     string
			Name   string
			Code   string
			Values map[int]string // индекс -> value
		}
		cfMap := map[int]*cfTemp{}

		// проход по всем ключам формы
		for k, vals := range r.Form {
			if len(vals) == 0 {
				continue
			}
			v := vals[0]

			// значение value в values[*][value]
			if m := reCFValue.FindStringSubmatch(k); m != nil {
				idx, _ := strconv.Atoi(m[1])
				valIdx, _ := strconv.Atoi(m[2])
				if _, ok := cfMap[idx]; !ok {
					cfMap[idx] = &cfTemp{Values: map[int]string{}}
				}
				cfMap[idx].Values[valIdx] = v
				continue
			}

			// поля id/name/code у кастомного поля
			if m := reCFField.FindStringSubmatch(k); m != nil {
				idx, _ := strconv.Atoi(m[1])
				field := m[2]
				if _, ok := cfMap[idx]; !ok {
					cfMap[idx] = &cfTemp{Values: map[int]string{}}
				}
				switch field {
				case "id":
					cfMap[idx].ID = v
				case "name":
					cfMap[idx].Name = v
				case "code":
					cfMap[idx].Code = v
				}
				continue
			}
		}

		// Сортируем индексы и строим payload того же типа
		var cfIndices []int
		for idx := range cfMap {
			cfIndices = append(cfIndices, idx)
		}
		sort.Ints(cfIndices)

		var payload dto.AmocrmWebhookLeadsForm
		payload.Leads.Update = make([]struct {
			ID           string `json:"id"`
			CustomFields []struct {
				Code   string `json:"code"`
				Name   string `json:"name"`
				Values []struct {
					Value string `json:"value"`
				} `json:"values"`
			} `json:"custom_fields"`
		}, 1)

		payload.Leads.Update[0].ID = leadIDStr

		for _, idx := range cfIndices {
			tmp := cfMap[idx]
			// собираем values в слайс по порядку индексов
			var valIdxs []int
			for vi := range tmp.Values {
				valIdxs = append(valIdxs, vi)
			}
			sort.Ints(valIdxs)

			values := make([]struct {
				Value string `json:"value"`
			}, 0, len(valIdxs))
			for _, vi := range valIdxs {
				values = append(values, struct {
					Value string `json:"value"`
				}{Value: tmp.Values[vi]})
			}

			payload.Leads.Update[0].CustomFields = append(payload.Leads.Update[0].CustomFields, struct {
				Code   string `json:"code"`
				Name   string `json:"name"`
				Values []struct {
					Value string `json:"value"`
				} `json:"values"`
			}{
				Code:   tmp.Code,
				Name:   tmp.Name,
				Values: values,
			})
		}

		// --- Теперь логика обработки, как в вашем исходном коде (один вызов UpdateOrderInfoByLeadId на lead) ---
		upd := payload.Leads.Update[0]
		leadID, err := strconv.ParseInt(upd.ID, 10, 64)
		if err != nil {
			log.Printf("Invalid lead ID %s: %v", upd.ID, err)
			w.WriteHeader(http.StatusOK)
			return
		}

		var status string
		var cleanersList []string
		var leadUpdated *time.Time

		lastModifiedStr := r.FormValue("leads[update][0][last_modified]")
		if lastModifiedStr != "" {
			if lastModified, err := strconv.ParseInt(lastModifiedStr, 10, 64); err == nil {
				t := time.Unix(lastModified, 0).UTC()
				leadUpdated = &t
			} else {
				log.Printf("Lead %d: invalid last_modified %q: %v", leadID, lastModifiedStr, err)
			}
		}

		for _, cf := range upd.CustomFields {
			// аккуратно: в форме иногда name==Status, а code может быть TYPE — учитываем оба варианта
			if cf.Code == "TYPE" || cf.Code == "Status" || strings.EqualFold(cf.Name, "Status") {
				if len(cf.Values) > 0 && cf.Values[0].Value != "" {
					status = cf.Values[0].Value
				}
				continue
			}
			if cf.Code == "CLEANERS" || strings.EqualFold(cf.Name, "CLEANERS") {
				for _, val := range cf.Values {
					if val.Value != "" {
						cleanersList = append(cleanersList, val.Value)
					}
				}
				continue
			}
		}

		// Если нет изменений — логируем и выходим
		if status == "" && len(cleanersList) == 0 && leadUpdated == nil {
			log.Printf("Lead %d: no relevant changes, skipping", leadID)
			w.WriteHeader(http.StatusOK)
			return
		}

		cleaners := ""
		if len(cleanersList) > 0 {
			cleaners = fmt.Sprintf("%d(%s)", len(cleanersList), strings.Join(cleanersList, ", "))
		}

		dto := types.UpdateOrderDto{
			AmocrmLeadId: leadID,
			Status:       status,
			Cleaners:     cleaners,
			LeadUpdated:  leadUpdated,
		}

		if err := ordSvc.UpdateOrderInfoByLeadId(r.Context(), dto); err != nil {
			log.Printf("Failed to update order for lead %d: %v", leadID, err)
		} else {
			log.Printf("Lead %d updated successfully: status=%q cleaners=%q", leadID, status, cleaners)
		}

		w.WriteHeader(http.StatusOK)
	}
}
