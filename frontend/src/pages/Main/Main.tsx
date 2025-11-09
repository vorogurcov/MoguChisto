import { RefObject, useRef } from "react";
import Page from "../../components/Page/Page";
import Application from "./components/Application/Application";
import ApplicationInfo from "./components/ApplicationInfo/ApplicationInfo";
import Cleaners from "./components/Cleaners/Cleaners";
import Services from "./components/Services/Services";
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
	const cleanersRef = useRef<HTMLDivElement>(null);
	const reciewesRef = useRef<HTMLDivElement>(null);
	const servicesRef = useRef<HTMLDivElement>(null);
	const jobSuggestionRef = useRef<HTMLDivElement>(null);
	const faqRef = useRef<HTMLDivElement>(null);
	const aboutRef = useRef<HTMLDivElement>(null);
	const contactsRef = useRef<HTMLDivElement>(null);

	const navigation: Record<PagePart, RefObject<HTMLDivElement | null>> = {
		[PagePart.top]: applicationRef,
		[PagePart.service]: servicesRef,
		[PagePart.cleaning]: cleaningRef,
		[PagePart.cleaners]: cleanersRef,
		[PagePart.about]: aboutRef,
		[PagePart.faq]: faqRef,
		[PagePart.contacts]: contactsRef,
		[PagePart.job]: jobSuggestionRef,
	};

	useSectionScroll(navigation);
	useSectionObserver(navigation);

	return (
		<Page>
			<Application ref={applicationRef} />
			<Services ref={servicesRef} />
			<ResultWorking ref={cleaningRef} />
			<Cleaners ref={cleanersRef} />
			<Reciewes ref={reciewesRef} />
			<ApplicationInfo ref={aboutRef} />
			<JobSuggestion ref={jobSuggestionRef} />
			<FAQ ref={faqRef} />
			<Footer ref={contactsRef} />
		</Page>
	);
}
