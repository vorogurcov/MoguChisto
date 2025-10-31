import { forwardRef } from "react";
import PageItem from "../../../../components/PageItem";
import { FooterSVG, StarSVG } from "../../../../public/svg";
import CardsRusult from "./CardsRusult";
import { TitleSVG } from "./SVG";

import "./css.scss";

const ResultWorking = forwardRef<HTMLDivElement>((_, ref) => {
	return (
		<PageItem className="resultWrapper">
			<div ref={ref} className="title">
				<TitleSVG />
			</div>
			<div className="description">
				<StarSVG />
				<span>
					Мы подбираем профессиональные средства для каждого типа загрязнений,
					что позволяет добиться идеально чистого результата
				</span>
			</div>
			<CardsRusult />
			<footer>
				<FooterSVG />
			</footer>
		</PageItem>
	);
});
ResultWorking.displayName = "ResultWorking";
export default ResultWorking;
