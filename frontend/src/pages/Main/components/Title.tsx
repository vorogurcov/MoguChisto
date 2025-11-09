import { ReactElement } from "react";
import "./Title.scss";
import useWindowWidth from "../../../hooks/useWindowWidth";
import classNames from "classnames";

export default function Info({
	children,
}: {
	children: ReactElement[] | ReactElement;
}) {
	const width = useWindowWidth();
	return (
		<div className={classNames("infoTitle", { infoTitleMobile: width < 1000 })}>
			{children}
		</div>
	);
}
