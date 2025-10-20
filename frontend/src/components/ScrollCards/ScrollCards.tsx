import { ReactElement } from "react";
import { LeftSVG, RightSVG } from "./SVG";
import "./css.scss";

type Props = {
	children: ReactElement[];
};

export default function ScrollCards({ children }: Props) {
	return (
		<div className="scrollContainer">
			<div className="children">{children}</div>
			<div className="buttons">
				<LeftSVG />
				<RightSVG />
			</div>
		</div>
	);
}
