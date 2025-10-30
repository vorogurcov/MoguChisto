import { RefObject, useEffect } from "react";
import { useActiveSectionContext } from "./ActiveSectionContext";
import { PagePart } from "../components/NavigatePanel/NavigatePanel";

export default function useSectionScroll(
	navigation: Record<PagePart, RefObject<HTMLDivElement | null>>,
) {
	const contextSection = useActiveSectionContext();

	useEffect(() => {
		if (
			contextSection?.shouldSmooth &&
			contextSection.activeSection &&
			navigation[contextSection.activeSection]
		) {
			contextSection.setShouldSmooth(false);
			navigation[contextSection.activeSection].current?.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [contextSection]);
}
