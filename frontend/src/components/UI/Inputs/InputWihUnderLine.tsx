import { useRef, useState } from "react";
import classNames from "classnames";
import "./css.scss";
import TextInput, { TextInputProps } from "./TextInput";

export default function InputWihUnderLine({
	className,
	onBlur,
	...props
}: TextInputProps) {
	const ref = useRef<HTMLInputElement | null>(null);
	const [hasValue, setHasValue] = useState(false);
	return (
		<TextInput
			ref={ref}
			{...props}
			className={classNames(
				"inputWihtUnderLine",
				{
					inputWihtUnderLineWithValue: hasValue,
				},
				className,
			)}
			onBlur={(e) => {
				setHasValue(!!ref.current?.value);
				onBlur?.(e);
			}}
		/>
	);
}
