import {
	RefObject,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
} from "react";
import Page from "../../components/Page/Page";
import Application from "./components/Application/Application";
import ApplicationInfo from "./components/ApplicationInfo/ApplicationInfo";
import Cleaners from "./components/Cleaners/Cleaners";
import Cleaning from "./components/Cleaning/Cleaning";
import FAQ from "./components/FAQ/FAQ";
import JobSuggestion from "./components/JobSuggestion/JobSuggestion";
import Reciewes from "./components/Reciewes/Reciewes";
import ResultWorking from "./components/ResultWorking/ResultWorking";
import { PagePart } from "../../components/NavigatePanel/NavigatePanel";
import useSectionScroll from "../../hooks/useSectionScroll";
import Footer from "../../components/Page/Footer/Footer";
import { useSectionObserver } from "../../hooks/useSectionObserver";

export default function Main() {
	const applicationRef = useRef<HTMLDivElement>(null);
	const cleaningRef = useRef<HTMLDivElement>(null);
	const resultWorkingRef = useRef<HTMLDivElement>(null);
	const cleanersRef = useRef<HTMLDivElement>(null);
	const reciewesRef = useRef<HTMLDivElement>(null);
	const applicationInfoRef = useRef<HTMLDivElement>(null);
	const jobSuggestionRef = useRef<HTMLDivElement>(null);
	const faqRef = useRef<HTMLDivElement>(null);
	const aboutRef = useRef<HTMLDivElement>(null);

	const navigation: Record<PagePart, RefObject<HTMLDivElement | null>> = {
		[PagePart.top]: applicationRef,
		[PagePart.about]: aboutRef,
		[PagePart.cleaners]: cleanersRef,
		[PagePart.cleaning]: cleaningRef,
		[PagePart.contacts]: aboutRef,
		[PagePart.faq]: faqRef,
		[PagePart.service]: applicationInfoRef,
	};

	useSectionScroll(navigation);
	useSectionObserver(navigation);

	return (
		<Page>
			<Application ref={applicationRef} />
			<Cleaning ref={applicationInfoRef} />
			<ResultWorking ref={resultWorkingRef} />
			<Cleaners ref={cleanersRef} />
			<Reciewes ref={reciewesRef} />
			<ApplicationInfo ref={applicationInfoRef} />
			<JobSuggestion ref={jobSuggestionRef} />
			<FAQ ref={faqRef} />
			<Footer ref={aboutRef} />
		</Page>
	);
}
