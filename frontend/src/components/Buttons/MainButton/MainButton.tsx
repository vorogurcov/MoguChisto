import classNames from "classnames";
import { ButtonPropsType } from "../ButtonPropsTypeAlias";
import "./css.scss";
import useWindowWidth from "../../../hooks/useWindowWidth";

export default function MainButton({
	children,
	className,
	submiting = false,
	submitingText,
	...props
}: ButtonPropsType & { submitingText?: string; submiting?: boolean }) {
	const width = useWindowWidth();
	return (
		<button
			className={classNames(className, "main", {
				mainButtonMobile: width < 500,
			})}
			{...props}
		>
			<span className={classNames("button-text", { hidden: submiting })}>
				{children}
			</span>
			<span className={classNames("button-text", { hidden: !submiting })}>
				{submitingText || children}
			</span>
		</button>
	);
}
