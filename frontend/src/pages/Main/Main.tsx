import Page from "../../components/Page/Page";
import Application from "./components/Application/Application";
import Cleaners from "./components/Cleaners/Cleaners";
import Cleaning from "./components/Cleaning/Cleaning";
import ResultWorking from "./components/ResultWorking/ResultWorking";

export default function Main() {
	return (
		<Page>
			<Application />
			<Cleaning />
			<ResultWorking />
			<Cleaners />
		</Page>
	);
}
