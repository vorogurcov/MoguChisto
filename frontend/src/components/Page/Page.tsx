import { ReactNode } from "react";
import NavigatePanel from "../NavigatePanel/NavigatePanel";
import "./css.scss";
import Footer from "./Footer/Footer";

export default function Page({ children }: { children: ReactNode }) {
	return (
		<>
			<header>
				<NavigatePanel />
			</header>
			<main className="page-content">{children}</main>
			<Footer />
		</>
	);
}
