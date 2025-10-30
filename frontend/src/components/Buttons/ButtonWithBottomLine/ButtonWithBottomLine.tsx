import classNames from "classnames";
import { ButtonPropsType } from "../ButtonPropsTypeAlias";
import "./css.scss";

export default function ButtonWithBottomLine({
	className,
	...props
}: ButtonPropsType) {
	return (
		<button className={classNames("withLineButton", className)} {...props}>
			{props.children}
		</button>
	);
}
