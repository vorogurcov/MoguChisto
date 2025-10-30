import React, { ReactNode } from "react";
import NavigatePanel from "../NavigatePanel/NavigatePanel";
import "./css.scss";

export default function Page({ children }: { children: ReactNode }) {
	return (
		<React.Fragment>
			<header>
				<NavigatePanel />
			</header>
			<main className="page-content">{children}</main>
		</React.Fragment>
	);
}
