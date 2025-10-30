import classNames from "classnames";
import { ButtonPropsType } from "../ButtonPropsTypeAlias";
import "./css.scss";

export default function ButtonLikeText({
	children,
	className,
	...props
}: ButtonPropsType) {
	return (
		<button className={classNames(className, "likeText")} {...props}>
			<b>{children}</b>
		</button>
	);
}
