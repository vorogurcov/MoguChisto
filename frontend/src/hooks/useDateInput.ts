import { ChangeEvent, useEffect, useState } from "react";
import { formatDate } from "../helpers/formatData";

const useDateInput = (initialValue = "") => {
	const [value, setValue] = useState("");

	useEffect(() => {
		setValue(formatDate(initialValue));
	}, [initialValue]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;

		setValue(formatDate(input));
	};

	// Функция для проверки реальной даты
	const isValidDate = (day: number, month: number, year: number): boolean => {
		if (year < 1900 || year > 2099) return false;
		if (month < 1 || month > 12) return false;
		if (day < 1 || day > 31) return false;

		const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		// Високосный год
		if (month === 2) {
			const isLeapYear =
				(year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
			return day <= (isLeapYear ? 29 : 28);
		}

		return day <= daysInMonth[month - 1];
	};

	const getDateValue = (): Date | null => {
		const parts = value.split(".");
		if (parts.length === 3 && parts.every((part) => part.length > 0)) {
			const day = parseInt(parts[0]);
			const month = parseInt(parts[1]);
			const year = parseInt(parts[2]);

			if (isValidDate(day, month, year)) {
				return new Date(year, month - 1, day);
			}
		}
		return null;
	};

	return {
		value,
		handleChange,
		getDateValue,
		isValid: () => getDateValue() !== null,
		setValue,
	};
};

export default useDateInput;
