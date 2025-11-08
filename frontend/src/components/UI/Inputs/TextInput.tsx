import classNames from "classnames";
import { InputPropsType } from "./InputPropsTypeAlias";
import "../common.scss";
import "./css.scss";
import InfoHover from "../../InfoHover/InfoHover";
import { ChangeEvent, forwardRef, useRef, useState } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";

export type TextInputProps = InputPropsType & {
	error?: string;
	title?: string;
	prompts?: string[];
	classnamecontainer?: string;
};

// Функция для получения неформатированного номера
const getRawPhoneNumber = (formatted: string): string => {
	return formatted ? "7" + formatted.replace(/\D/g, "").slice(1) : "";
};

function PhoneInput({
	placeholder = "+7 (999) 999-99-99",
	value = "",
	onChange,
	...props
}: InputPropsType) {
	const [displayValue, setDisplayValue] = useState<string>(value.toString());
	const inputRef = useRef<HTMLInputElement>(null);
	const formatPhoneNumber = (input: string): string => {
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
		console.log("formatted", formatted);
		return formatted;
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;
		const formatted = formatPhoneNumber(input);

		// Создаем новое событие с отформатированным значением
		const newEvent = {
			...e,
			target: {
				...e.target,
				value: formatted,
			},
			currentTarget: {
				...e.currentTarget,
				value: formatted,
			},
		} as ChangeEvent<HTMLInputElement>;

		// Вызываем оригинальный onChange с новым событием
		if (onChange) {
			onChange(newEvent);
		}
		setDisplayValue(formatted);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// Разрешаем: backspace, delete, tab, escape, enter
		if ([8, 9, 27, 13].includes(e.keyCode)) {
			if (
				displayValue.at(-1) &&
				["(", ")", " ", "-"].includes(displayValue[displayValue.length - 1])
			) {
				setDisplayValue(
					displayValue.slice(
						0,
						displayValue[displayValue.length - 2] === ")"
							? displayValue.length - 2
							: displayValue.length - 1,
					),
				);
			}
			return;
		}

		// Разрешаем: home, end, left, right
		if (e.keyCode >= 35 && e.keyCode <= 39) {
			return;
		}

		// Запрещаем ввод нецифровых символов, кроме Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
		if (
			(e.keyCode < 48 || e.keyCode > 57) &&
			(e.keyCode < 96 || e.keyCode > 105)
		) {
			if (!e.ctrlKey && !e.metaKey) {
				e.preventDefault();
			}
		}
	};

	return (
		<input
			ref={inputRef}
			{...props}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			className={classNames("rectangle", props.className)}
			placeholder={placeholder}
			value={displayValue}
			type="tel"
		/>
	);
}

export const isValidNumber = (number: string) =>
	getRawPhoneNumber(number).length === 11;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	({ title, prompts, type, error, ...props }, ref) => {
		const width = useWindowWidth();
		return (
			<div
				className={classNames(props.classnamecontainer, "containerRectangle")}
			>
				{title && (
					<div className="titleContainer">
						<span className="title">{title}</span>
						{prompts && <InfoHover infoStrings={prompts} />}
					</div>
				)}
				{type === "phone" ? (
					<PhoneInput
						{...props}
						className={classNames(props.className, {
							rectangleMobile: width < 600,
						})}
					/>
				) : (
					<input
						ref={ref}
						{...props}
						type={type ?? "text"}
						className={classNames("rectangle", props.className, {
							rectangleMobile: width < 600,
						})}
					/>
				)}
				{error && <div className="errorInput">{error}</div>}
			</div>
		);
	},
);
TextInput.displayName = "TextInput";
export default TextInput;
