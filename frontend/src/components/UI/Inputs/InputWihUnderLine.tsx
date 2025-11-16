import classNames from "classnames";
import "./css.scss";
import TextInput, { TextInputProps } from "./TextInput";

export default function InputWihUnderLine({
	className,
	hasValue,
	...props
}: TextInputProps & { hasValue?: boolean }) {
	return (
		<TextInput
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
