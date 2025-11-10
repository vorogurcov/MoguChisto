export const formatDateForInput = (value?: string | Date): string => {
	if (!value) return "";

	if (value instanceof Date) {
		return value.toISOString().split("T")[0];
	}

	if (typeof value === "string") {
		// Если это строка в формате ISO или другой
		try {
			const date = new Date(value);
			return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
		} catch {
			return "";
		}
	}

	return "";
};

export const formatPhoneNumber = (input: string): string => {
	// Удаляем все нецифровые символы, кроме возможного плюса в начале
	let numbers = input.replace(/\D/g, "");

	// Если номер начинается с 7 или 8, заменяем на +7
	if (numbers.startsWith("7") || numbers.startsWith("8")) {
		numbers = "7" + numbers.slice(1);
	}
	// Если номер не начинается с 7, добавляем +7
	else if (!numbers.startsWith("7") && numbers.length > 0) {
		numbers = "7" + numbers;
	}

	// Ограничиваем длину (1 код страны + 10 цифр номера)
	numbers = numbers.slice(0, 11);

	// Форматируем номер
	let formatted = "";
	if (numbers.length > 0) {
		formatted = "+7 ";
		if (numbers.length > 1) {
			formatted += "(" + numbers.slice(1, 4);
		}
		if (numbers.length >= 4) {
			formatted += ") " + numbers.slice(4, 7);
		}
		if (numbers.length >= 7) {
			formatted += "-" + numbers.slice(7, 9);
		}
		if (numbers.length >= 9) {
			formatted += "-" + numbers.slice(9, 11);
		}
	}
	return formatted;
};
