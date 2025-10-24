import classNames from "classnames";
import { ButtonPropsType } from "../ButtonPropsTypeAlias";
import "./css.scss";

export default function ButtonWithBottomLine({ ...props }: ButtonPropsType) {
	return (
		<button className={classNames("witLineButton", props.className)} {...props}>
			{props.children}
		</button>
	);
}
