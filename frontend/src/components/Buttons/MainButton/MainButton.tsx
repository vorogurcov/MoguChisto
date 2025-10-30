import classNames from "classnames";
import { ButtonPropsType } from "../ButtonPropsTypeAlias";
import "./css.scss";

export default function MainButton({
	children,
	className,
	...props
}: ButtonPropsType) {
	return (
		<button className={classNames(className, "main")} {...props}>
			{children}
		</button>
	);
}
