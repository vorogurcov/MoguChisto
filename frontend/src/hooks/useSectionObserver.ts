// hooks/useSectionObserver.ts
import { RefObject, useEffect, useRef } from "react";
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
				// Находим entry, которое пересекает верхнюю половину экрана
				let activeEntry: IntersectionObserverEntry | null = null;
				let minTopValue = Infinity;

				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const rect = entry.boundingClientRect;
						const viewportHeight = window.innerHeight;

						// Элемент пересекает верхнюю половину экрана, если:
						// - Его верхняя граница выше середины экрана ИЛИ
						// - Его нижняя граница выше середины экрана ИЛИ
						// - Он охватывает середину экрана
						const intersectsTopHalf =
							rect.top <= viewportHeight / 2 ||
							rect.bottom <= viewportHeight / 2 ||
							(rect.top <= viewportHeight / 2 &&
								rect.bottom >= viewportHeight / 2);

						if (intersectsTopHalf) {
							// Выбираем элемент с наименьшим top значением (ближайший к верху)
							if (rect.top < minTopValue) {
								minTopValue = rect.top;
								activeEntry = entry;
							}
						}
					}
				});

				// Если нашли активную секцию
				if (activeEntry) {
					const activeSection = Object.entries(sectionRefs).find(
						([, ref]) => ref.current === activeEntry?.target,
					)?.[0] as unknown as PagePart;

					if (activeSection && activeSection !== context.activeSection) {
						console.log("Setting active section from observer:", activeSection);
						context.setActiveSection(activeSection);
					}
				}
			},
			{
				root: null, // viewport
				rootMargin: "0px 0px -50% 0px", // наблюдаем от верха до середины экрана
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
