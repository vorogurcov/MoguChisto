// contexts/ActiveSectionContext.tsx
import { createContext, ReactNode, useContext, useState } from "react";
import { PagePart } from "../components/NavigatePanel/NavigatePanel";

export interface ActiveSectionContextType {
	activeSection: PagePart | null;
	setActiveSection: (section: PagePart | null) => void;
	shouldSmooth: boolean;
	setShouldSmooth: (smooth: boolean) => void;
}

const ActiveSectionContext = createContext<
	ActiveSectionContextType | undefined
>(undefined);

export const useActiveSectionContext = () => useContext(ActiveSectionContext);

export const ActiveSectionProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [activeSection, setActiveSection] = useState<PagePart | null>(
		PagePart.top,
	);
	const [shouldSmooth, setShouldSmooth] = useState<boolean>(false);

	const value = {
		activeSection,
		setActiveSection,
		shouldSmooth,
		setShouldSmooth,
	};

	return (
		<ActiveSectionContext.Provider value={value}>
			{children}
		</ActiveSectionContext.Provider>
	);
};
