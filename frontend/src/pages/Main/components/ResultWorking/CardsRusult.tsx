import { useState } from "react";
import ScrollCards from "../../../../components/ScrollCards/ScrollCards";
import bef from "../../../../public/imgs/results/bef.jpg";
import aft from "../../../../public/imgs/results/aft.png";
import aga from "./aga.jpg";
import CardItemInfo from "../../../../components/CardItemInfo/CardItemInfo";
import CardInfoPanel from "../../../../components/CardInfoPanel/CardInfoPanel";
import { MiniCleanerSVG } from "../../../../public/svg";

type ImgsResultT = {
	before: string;
	after: string;
};

type CardResultT = {
	price: number;
	countCleaner: number;
	time: string;
	square: number;
	services?: string;
	imgs: ImgsResultT[];
	title?: string;
};

const cards: CardResultT[] = [
	{
		price: 6500,
		countCleaner: 2,
		time: "2,5",
		square: 15,
		services: "PRO средства",
		imgs: [
			{ before: bef, after: aft },
			{ before: aga, after: aga },
		],
		title: "Генеральная уборка кухни",
	},
	{
		price: 6500,
		countCleaner: 2,
		time: "2,5",
		square: 15,
		services: "PRO средства",
		imgs: [{ before: bef, after: aft }],
		title: "Генеральная уборка кухни",
	},
	{
		price: 6500,
		countCleaner: 2,
		time: "2,5",
		square: 15,
		services: "PRO средства",
		imgs: [{ before: bef, after: aft }],
		title: "Генеральная уборка кухни",
	},
	{
		price: 6500,
		countCleaner: 2,
		time: "2,5",
		square: 15,
		services: "PRO средства",
		imgs: [{ before: bef, after: aft }],
		title: "Генеральная уборка кухни",
	},
];

function ImgsResult({ imgs }: { imgs: ImgsResultT[] }) {
	const [selected, setSelected] = useState(0);
	const handleSelect = (index: number) => {
		if (imgs.length > index && index != -1) {
			setSelected(index);
		}
	};
	return (
		<div className="imgs">
			<div className="img">
				<img src={imgs[selected].before} alt="before" />
			</div>
			<div className="img">
				<img src={imgs[selected].after} alt="after" />
			</div>
			<div className="changePicture">
				<button className="leftSkip" onClick={() => handleSelect(selected + 1)}>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6 0L7.0575 1.0575L2.8725 5.25H12V6.75H2.8725L7.065 10.935L6 12L0 6L6 0Z"
							fill="#292929"
						/>
					</svg>
				</button>
				<button
					className="rightSkip"
					onClick={() => handleSelect(selected - 1)}
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6 0L4.9425 1.0575L9.1275 5.25H0V6.75H9.1275L4.935 10.935L6 12L12 6L6 0Z"
							fill="#292929"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}

function CardResult({
	price,
	countCleaner,
	time,
	square,
	services,
	imgs,
	title,
}: CardResultT) {
	return (
		<div className="card">
			<CardInfoPanel>
				<CardItemInfo className="item priceCard">{price}₽</CardItemInfo>
				<CardItemInfo>
					<MiniCleanerSVG className="svg" />
					{countCleaner}
				</CardItemInfo>
				<CardItemInfo>{time} часов</CardItemInfo>
				<CardItemInfo>{square}м²</CardItemInfo>
				<CardItemInfo>{services}</CardItemInfo>
			</CardInfoPanel>
			<ImgsResult imgs={imgs} />
			<p className="title">
				<b>{title}</b>
			</p>
		</div>
	);
}

export default function CardsRusult() {
	return (
		<div>
			<ScrollCards>
				{cards.map((card, index) => (
					<CardResult key={index} {...card} />
				))}
			</ScrollCards>
		</div>
	);
}
