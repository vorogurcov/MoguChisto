import { useState } from "react";
import { MiniCleanerSVG } from "./SVG";
import ScrollCards from "../../../../components/ScrollCards/ScrollCards";
import bef from "../../../../public/imgs/results/bef.jpg";
import aft from "../../../../public/imgs/results/aft.png";

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

const ButtonSvg = () => (
	<svg
		width="66"
		height="66"
		viewBox="0 0 66 66"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="0.5" y="0.787109" width="65" height="65" rx="32.5" fill="white" />
		<g clipPath="url(#clip0_9_354)">
			<path
				d="M45 27.2871L43.9425 28.3446L48.1275 32.5371H39V34.0371H48.1275L43.935 38.2221L45 39.2871L51 33.2871L45 27.2871Z"
				fill="#292929"
			/>
		</g>
		<g clipPath="url(#clip1_9_354)">
			<path
				d="M21 27.2871L22.0575 28.3446L17.8725 32.5371H27V34.0371H17.8725L22.065 38.2221L21 39.2871L15 33.2871L21 27.2871Z"
				fill="#292929"
			/>
		</g>
		<defs>
			<clipPath id="clip0_9_354">
				<rect
					width="18"
					height="18"
					fill="white"
					transform="matrix(0 1 -1 0 54 24.2871)"
				/>
			</clipPath>
			<clipPath id="clip1_9_354">
				<rect
					width="18"
					height="18"
					fill="white"
					transform="matrix(0 1 1 0 12 24.2871)"
				/>
			</clipPath>
		</defs>
	</svg>
);

function ImgsResult({ imgs }: { imgs: ImgsResultT[] }) {
	const [selected, setSelected] = useState(0);
	return (
		<div className="imgs">
			<div className="img">
				<img src={imgs[selected].before} alt="before" />
			</div>
			<div className="img">
				<img src={imgs[selected].after} alt="after" />
			</div>
			<div className="changePicture">
				<ButtonSvg />
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
			<div className="info">
				<div className="item priceCard">{price}₽</div>
				<div className="item">
					<MiniCleanerSVG className="svg" />
					{countCleaner}
				</div>
				<div className="item">{time} часов</div>
				<div className="item">{square}м²</div>
				<div className="item">{services}</div>
			</div>
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
