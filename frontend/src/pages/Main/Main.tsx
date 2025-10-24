import Page from "../../components/Page/Page";
import Application from "./components/Application/Application";
import ApplicationInfo from "./components/ApplicationInfo/ApplicationInfo";
import Cleaners from "./components/Cleaners/Cleaners";
import Cleaning from "./components/Cleaning/Cleaning";
import Reciewes from "./components/Reciewes/Reciewes";
import ResultWorking from "./components/ResultWorking/ResultWorking";

export default function Main() {
	return (
		<Page>
			<Application />
			<Cleaning />
			<ResultWorking />
			<Cleaners />
			<Reciewes />
			<ApplicationInfo />
		</Page>
	);
}
