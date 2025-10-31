import { ReactElement, RefObject, useRef } from "react";
import { LeftSVG, RightSVG } from "./SVG";
import "./css.scss";

type Props = {
	children: ReactElement[];
};

export default function ScrollCards({ children }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);

	const getAmount = (containerRef: RefObject<HTMLDivElement>) => {
		const container = containerRef.current;
		const items = container.children;
		const firstItem = items[0] as HTMLElement;
		const itemWidth = firstItem.offsetWidth;
		const viewportWidth = window.innerWidth;
		const itemWidthPercent = (itemWidth / viewportWidth) * 100;

		let scrollCount = 1; // по умолчанию на 1 элемент

		if (itemWidthPercent >= 30) {
			scrollCount = 1; // широкая карточка - скроллим на 1
		} else if (itemWidthPercent >= 10) {
			scrollCount = 2; // средняя карточка - скроллим на 2
		} else {
			scrollCount = 3; // узкая карточка - скроллим на 3
		}
		const gap = parseInt(getComputedStyle(container).gap) || 0;
		const scrollAmount = (itemWidth + gap) * scrollCount;
		return scrollAmount;
	};

	const scrollRight = () => {
		if (containerRef.current) {
			const container = containerRef.current;
			const scrollAmount = getAmount(containerRef as RefObject<HTMLDivElement>);
			console.log("scrollBehavior" in document.documentElement.style);
			container.scrollBy({
				left: scrollAmount,
				behavior: "smooth",
			});
		}
	};
	const scrollLeft = () => {
		if (containerRef.current) {
			const container = containerRef.current;
			const scrollAmount = getAmount(containerRef as RefObject<HTMLDivElement>);
			container.scrollBy({
				left: -scrollAmount,
				behavior: "smooth",
			});
		}
	};
	return (
		<div className="scrollContainer">
			<div ref={containerRef} className="children">
				{children}
			</div>
			<div className="buttons">
				<LeftSVG onClick={scrollLeft} />
				<RightSVG onClick={scrollRight} />
			</div>
		</div>
	);
}
