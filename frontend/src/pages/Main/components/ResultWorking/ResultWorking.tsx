import PageItem from "../../../../components/PageItem";
import { FooterSVG, StarSVG } from "../../../../public/svg";
import CardsRusult from "./CardsRusult";
import { TitleSVG } from "./SVG";

import "./css.scss";

export default function ResultWorking() {
	return (
		<PageItem className="resultWrapper">
			<div className="title">
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
}
