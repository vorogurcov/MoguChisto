import { forwardRef } from "react";
import ScrollCards from "../../../../components/ScrollCards/ScrollCards";
import "./css.scss";
import Info from "../Title";
import PageItem from "../../../../components/PageItem";

import photo35 from "./photos/1 (35) (1).jpg";
import photo3 from "./photos/1 (3) (1).jpg";
import photo15 from "./photos/1 (15) (1).jpg";
import photo8 from "./photos/1 (8) (1).jpg";
import photo10 from "./photos/1 (10) (1).jpg";
import photo37 from "./photos/1 (37).jpg";
import photo41 from "./photos/1 (41) (1).jpg";
import photo21 from "./photos/1 (21) (1).jpg";
import photo30 from "./photos/1 (30) (1).jpg";

type CardT = {
	description: "Чисто";
	img: string;
};

const cards: CardT[] = [
	{
		description: "Чисто",
		img: photo35,
	},
	{
		description: "Чисто",
		img: photo3,
	},
	{
		description: "Чисто",
		img: photo15,
	},
	{
		description: "Чисто",
		img: photo8,
	},
	{
		description: "Чисто",
		img: photo10,
	},
	{
		description: "Чисто",
		img: photo37,
	},
	{
		description: "Чисто",
		img: photo41,
	},
	{
		description: "Чисто",
		img: photo21,
	},
	{
		description: "Чисто",
		img: photo30,
	},
];

function OneCard({ img }: CardT) {
	return (
		<div className="cardCleaner">
			<img src={img} alt="cleaner" loading="lazy" />
			{/* <div className="img">
				<img src={img} alt="cleaner" loading="lazy" />
			</div> */}
		</div>
	);
}

const Cleaners = forwardRef<HTMLDivElement>((_, ref) => {
	return (
		<PageItem className="cleaners">
			<Info>
				<span ref={ref}>
					<b>Наша команда</b>
				</span>
			</Info>
			<ScrollCards>
				{cards.map((card, index) => (
					<OneCard key={index} {...card} />
				))}
			</ScrollCards>
		</PageItem>
	);
});
Cleaners.displayName = "Cleaners";
export default Cleaners;
