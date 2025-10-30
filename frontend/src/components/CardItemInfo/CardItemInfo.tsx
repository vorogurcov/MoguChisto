import { HTMLAttributes } from "react";
import "./css.scss";
import classNames from "classnames";

export default function CardItemInfo({
	children,
	className,
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={classNames("CardItemInfo", className)}>{children}</div>
	);
}
