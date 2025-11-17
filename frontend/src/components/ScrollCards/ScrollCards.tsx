import { ReactElement, RefObject, useRef } from "react";
import { LeftSVG, RightSVG } from "./SVG";
import "./css.scss";
import ButtonLikeText from "../Buttons/ButtonLikeText/ButtonLikeText";

type Props = {
	children: ReactElement[];
};

export default function ScrollCards({ children }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);

	const getAmount = (containerRef: RefObject<HTMLDivElement>) => {
		const container = containerRef.current;
		if (container) {
			const items = container.children;
			const firstItem = items[0] as HTMLElement;
			const itemWidth = firstItem.offsetWidth;
			const viewportWidth = window.innerWidth;
			const itemWidthPercent = (itemWidth / viewportWidth) * 100;

			let scrollCount = 1; // по умолчанию на 1 элемент
			const margin =
				Number(
					firstItem.style.marginRight.slice(
						0,
						firstItem.style.marginRight.length - 2,
					),
				) ?? 0;
			console.log("firstItem.style", container.children);

			if (itemWidthPercent >= 30) {
				scrollCount = 1; // широкая карточка - скроллим на 1
			} else if (itemWidthPercent >= 10) {
				scrollCount = 2; // средняя карточка - скроллим на 2
			} else {
				scrollCount = 3; // узкая карточка - скроллим на 3
			}
			const gap = parseInt(getComputedStyle(container).gap) || 0;
			const scrollAmount = (itemWidth + gap + margin) * scrollCount;
			return scrollAmount;
		}
		return 0;
	};

	const scrollRight = () => {
		if (containerRef.current) {
			const container = containerRef.current;
			const scrollAmount = getAmount(containerRef as RefObject<HTMLDivElement>);
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
				<ButtonLikeText>
					<LeftSVG onClick={scrollLeft} />
				</ButtonLikeText>
				<ButtonLikeText>
					<RightSVG onClick={scrollRight} />
				</ButtonLikeText>
			</div>
		</div>
	);
}
