import { ReactElement } from "react";
import "./css.scss";

export default function CardInfoPanel({
	children,
}: {
	children: ReactElement[] | ReactElement;
}) {
	return <div className="CardInfoPanel">{children}</div>;
}
