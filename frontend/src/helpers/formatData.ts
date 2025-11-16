export const formatDateForInput = (value?: string | Date): string => {
	if (!value) return "";

	if (value instanceof Date) {
		return value.toISOString().split("T")[0];
	}

	if (typeof value === "string") {
		// Если это строка в формате ISO или другой
		try {
			const parts = value.split(".");
			const day = parseInt(parts[0]);
			const month = parseInt(parts[1]) - 1; // месяцы в JS от 0 до 11
			const year = parseInt(parts[2]);

			const date = new Date(year, month, day);
			return date.toISOString().split("T")[0];
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

export const formatDate = (input: string) => {
	let parsedDate;
	if (input.split("-").length > 1) {
		const date = new Date(input);

		// Форматируем в нужный вид
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		parsedDate = `${day}${month}${year}`;
	} else {
		parsedDate = input;
	}
	// Удаляем все символы, кроме цифр
	const cleaned = parsedDate.replace(/\D/g, "");

	// Автоматически добавляем точки после 2 и 4 цифр
	let formatted = "";

	if (cleaned.length <= 2) {
		// Только день: "12"
		formatted = cleaned;
	} else if (cleaned.length <= 4) {
		// День и месяц: "1209" -> "12.09"
		formatted = `${cleaned.substring(0, 2)}.${cleaned.substring(2)}`;
	} else {
		// Полная дата: "12092024" -> "12.09.2024"
		formatted = `${cleaned.substring(0, 2)}.${cleaned.substring(2, 4)}.${cleaned.substring(4)}`;
		console.log("formatted, cleaned", formatted, cleaned);
	}

	// Валидация и форматирование частей даты
	const parts = formatted.split(".");

	// День (1-31)
	if (parts[0]) {
		let day = parts[0];
		const dayNum = parseInt(day);

		if (dayNum > 31) day = "31";
		else if (dayNum < 1 && day.length === 2) day = "01";
		else if (day.length === 1 && dayNum > 3) day = "0" + day;

		console.log("month", day);
		parts[0] = day;
	}

	// Месяц (1-12)
	if (parts[1]) {
		let month = parts[1];
		const monthNum = parseInt(month);

		if (monthNum > 12) month = "12";
		else if (monthNum < 1 && month.length === 2) month = "01";
		else if (month.length === 1 && monthNum > 1) month = "0" + month;

		console.log("month", month);
		parts[1] = month;
	}

	// Год (1900-2099)
	if (parts[2]) {
		let year = parts[2];
		if (year.length > 4) year = year.substring(0, 4);

		parts[2] = year;
	}

	return parts.join(".");
};
