import classNames from "classnames";
import { ReactElement } from "react";
import "./css.scss";

export default function BorderedItem({
	children,
	className,
}: {
	children: ReactElement | ReactElement[];
	className?: string;
}) {
	return (
		<div className={classNames("BorderedItem", className)}>{children}</div>
	);
}
