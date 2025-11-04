import { ReactElement } from "react";
import "./css.scss";

export default function ModalHeader({
	title,
	children,
}: {
	title: string;
	children: ReactElement | string;
}) {
	return (
		<div className="modalHeader">
			<p className="titleModal">
				<b>{title}</b>
			</p>
			<div className="descrModal">{children}</div>
		</div>
	);
}
