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
			<p className="descrModal">{children}</p>
		</div>
	);
}
