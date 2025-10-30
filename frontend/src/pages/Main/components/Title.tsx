import { ReactElement } from "react";
import "./Title.scss";

export default function Info({
	children,
}: {
	children: ReactElement[] | ReactElement;
}) {
	return <div className="infoTitle">{children}</div>;
}
