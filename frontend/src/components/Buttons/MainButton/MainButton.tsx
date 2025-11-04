import classNames from "classnames";
import { ButtonPropsType } from "../ButtonPropsTypeAlias";
import "./css.scss";

export default function MainButton({
	children,
	className,
	submiting = false,
	submitingText,
	...props
}: ButtonPropsType & { submitingText?: string; submiting?: boolean }) {
	return (
		<button className={classNames(className, "main")} {...props}>
			{submiting && submitingText ? submitingText : children}
		</button>
	);
}
