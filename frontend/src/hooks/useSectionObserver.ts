// hooks/useSectionObserver.ts
import { RefObject, useContext, useEffect, useRef } from "react";
import { PagePart } from "../components/NavigatePanel/NavigatePanel";
import { useActiveSectionContext } from "./ActiveSectionContext";

export const useSectionObserver = (
	sectionRefs: Record<PagePart, RefObject<HTMLDivElement | null>>,
) => {
	const context = useActiveSectionContext();
	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (!context) return;

		// Создаем Intersection Observer
		observer.current = new IntersectionObserver(
			(entries) => {
				// Находим entry, которое ближе всего к центру экрана
				let closestEntry: IntersectionObserverEntry | null = null;
				let closestDistance = Infinity;

				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const rect = entry.boundingClientRect;
						const centerY = window.innerHeight / 2;
						const distance = Math.abs(rect.top + rect.height / 2 - centerY);

						if (distance < closestDistance) {
							closestDistance = distance;
							closestEntry = entry;
						}
					}
				});

				// Если нашли ближайшую секцию и она достаточно близко к центру
				if (closestEntry && closestDistance < window.innerHeight * 0.4) {
					const activeSection = Object.entries(sectionRefs).find(
						([, ref]) => ref.current === closestEntry?.target,
					)?.[0] as unknown as PagePart;

					if (activeSection && activeSection !== context.activeSection) {
						console.log("Setting active section from observer:", activeSection);
						context.setActiveSection(activeSection);
					}
				}
			},
			{
				root: null, // viewport
				rootMargin: "-50% 0px -50% 0px", // наблюдаем только центральную часть экрана
				threshold: 0, // срабатывает при любом пересечении
			},
		);

		// Начинаем наблюдать за всеми секциями
		Object.values(sectionRefs).forEach((ref) => {
			if (ref.current) {
				observer.current?.observe(ref.current);
			}
		});

		return () => {
			if (observer.current) {
				observer.current.disconnect();
			}
		};
	}, [context, sectionRefs]);
};
