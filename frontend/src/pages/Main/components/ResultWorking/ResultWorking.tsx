import { FooterSVG } from "../../../../public/svg";
import CardsRusult from "./CardsRusult";
import { StarSVG, TitleSVG } from "./SVG";

import "./css.scss";

export default function ResultWorking() {
	return (
		<div className="resultWrapper page-item">
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
		</div>
	);
}
