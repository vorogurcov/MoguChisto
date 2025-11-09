import { ReactElement } from "react";
import Page from "../../../../components/Page/Page";
import PageItem from "../../../../components/PageItem";
import "./css.scss";
import Footer from "../../../../components/Page/Footer/Footer";

export default function ProfileTemplate({
	children,
}: {
	children?: ReactElement | ReactElement[];
}) {
	return (
		<Page>
			<PageItem className="profilePage">{children}</PageItem>
			<Footer />
		</Page>
	);
}
