import classNames from "classnames";
import { InputPropsType } from "./InputPropsTypeAlias";
import "../common.scss";
import "./css.scss";
import InfoHover from "../../InfoHover/InfoHover";
import { ChangeEvent, forwardRef, useEffect, useRef, useState } from "react";
import useWindowWidth from "../../../hooks/useWindowWidth";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { formatPhoneNumber } from "../../../helpers/formatData";
import useDateInput from "../../../hooks/useDateInput";

export type CustomInputLabelsT = {
	error?: string;
	title?: string;
	prompts?: string[];
	classnamecontainer?: string;
};

export type TextInputProps = InputPropsType & CustomInputLabelsT;

// Функция для получения неформатированного номера
export const getRawPhoneNumber = (formatted: string): string => {
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

	useEffect(() => {
		setDisplayValue(formatPhoneNumber(value.toString()));
	}, [value]);

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

const DateInput = ({ className, value, ...props }: TextInputProps) => {
	const width = useWindowWidth();
	const { value: display } = useDateInput(value?.toString());

	return (
		<input
			{...props}
			type="text"
			className={classNames("rectangle", className, {
				rectangleMobile: width < 600,
			})}
			value={display}
		/>
	);
};

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
							readOnly: props.readOnly,
						})}
					/>
				) : type === "date" ? (
					<DateInput
						{...props}
						className={classNames("rectangle", props.className, {
							rectangleMobile: width < 600,
							readOnly: props.readOnly,
						})}
					/>
				) : (
					<input
						ref={ref}
						{...props}
						type={type ?? "text"}
						className={classNames("rectangle", props.className, {
							rectangleMobile: width < 600,
							readOnly: props.readOnly,
						})}
					/>
				)}
				<ErrorMessage>{error}</ErrorMessage>
			</div>
		);
	},
);
TextInput.displayName = "TextInput";
export default TextInput;
