import classNames from "classnames";
import "./css.scss";
import TextInput, { TextInputProps } from "./TextInput";

export default function InputWihUnderLine({
	className,
	value,
	hasValue,
	...props
}: TextInputProps & { hasValue?: boolean }) {
	return (
		<TextInput
			value={value}
			{...props}
			className={classNames(
				"inputWihtUnderLine",
				{
					inputWihtUnderLineWithValue: hasValue,
				},
				className,
			)}
		/>
	);
}
