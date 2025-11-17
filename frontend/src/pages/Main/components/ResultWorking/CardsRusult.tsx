import ScrollCards from "../../../../components/ScrollCards/ScrollCards";
import CardItemInfo from "../../../../components/CardItemInfo/CardItemInfo";
import CardInfoPanel from "../../../../components/CardInfoPanel/CardInfoPanel";
import { MiniCleanerSVG } from "../../../../public/svg";
import { useCallback, useEffect, useRef, useState } from "react";

// Импорт всех фотографий "до"
import ГрязнаяПлита from "./cards/Грязная плита.png";
import ГрязнаяПлиткаВанна from "./cards/Грязная плитка ванна.png";
import ГрязнаяПодкухня from "./cards/Грязная подкухня.png";
import ГрязнаяРучка from "./cards/Грязная ручка.png";
import ГрязнаяСтиралка from "./cards/Грязная стиралка.png";
import ГрязноЗаСтолом from "./cards/Грязно за столом.png";
import ГрязноСверху from "./cards/Грязно сверху.png";
import ХолодосГрязный from "./cards/Холодос грязный.png";

// Импорт всех фотографий "после"
import ЧистаяПлита from "./cards/Чистая плита.png";
import ЧистаяПлиткаВанна from "./cards/Чистая плитка ванна.png";
import ЧистаяПодкухня from "./cards/Чистая подкухня.png";
import ЧистаяРучка from "./cards/Чистая ручка.png";
import ЧистаяСтиралка from "./cards/Чистая стиралка.png";
import ЧистоЗаСтолом from "./cards/Чисто за столом.png";
import ЧистоСверху from "./cards/Чисто сверху.png";
import ХолодосЧистый from "./cards/Холодос чистый.png";

// Массив объектов
const cards: CardResultT[] = [
	{
		price: 10600,
		countCleaner: 1,
		time: "5",
		square: 25,
		services: "PRO средства",
		imgs: { before: ХолодосГрязный, after: ХолодосЧистый },
		title: "Чистка бытовой техники",
	},
	{
		price: 23275,
		countCleaner: 3,
		time: "6.5",
		square: 72,
		services: "PRO средства",
		imgs: { before: ГрязноСверху, after: ЧистоСверху },
		title: "Уборка верхних поверхностей",
	},
	{
		price: 10600,
		countCleaner: 1,
		time: "5",
		square: 25,
		services: "PRO средства",
		imgs: { before: ГрязнаяПлита, after: ЧистаяПлита },
		title: "Комплексная уборка кухни",
	},
	{
		price: 11550,
		countCleaner: 1,
		time: "3",
		square: 5,
		services: "PRO средства",
		imgs: { before: ГрязнаяПлиткаВанна, after: ЧистаяПлиткаВанна },
		title: "Элит уборка ванной",
	},
	{
		price: 10600,
		countCleaner: 1,
		time: "5",
		square: 25,
		services: "PRO средства",
		imgs: { before: ГрязнаяПодкухня, after: ЧистаяПодкухня },
		title: "Уборка подкухонного пространства",
	},
	{
		price: 23000,
		countCleaner: 3,
		time: "5",
		square: 70,
		services: "PRO средства",
		imgs: { before: ГрязнаяРучка, after: ЧистаяРучка },
		title: "Чистка дверных ручек",
	},
	{
		price: 23275,
		countCleaner: 3,
		time: "6.5",
		square: 72,
		services: "PRO средства",
		imgs: { before: ГрязнаяСтиралка, after: ЧистаяСтиралка },
		title: "Комплексная уборка ванной",
	},
	{
		price: 23275,
		countCleaner: 3,
		time: "6.5",
		square: 72,
		services: "PRO средства",
		imgs: { before: ГрязноЗаСтолом, after: ЧистоЗаСтолом },
		title: "Уборка под мебелью",
	},
];

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
	imgs: ImgsResultT;
	title?: string;
};

function ImgsResult({ imgs }: { imgs: ImgsResultT }) {
	const [sliderPosition, setSliderPosition] = useState(50); // 50% по умолчанию
	const containerRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleMove = useCallback(
		(clientX: number) => {
			if (!containerRef.current || !isDragging) return;

			const containerRect = containerRef.current.getBoundingClientRect();
			const relativeX = clientX - containerRect.left;
			const percentage = (relativeX / containerRect.width) * 100;

			// Ограничиваем от 5% до 95% для удобства
			const newPosition = Math.max(5, Math.min(95, percentage));
			setSliderPosition(newPosition);
		},
		[isDragging],
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			handleMove(e.clientX);
		},
		[handleMove],
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			e.preventDefault();
			e.stopPropagation();
			handleMove(e.touches[0].clientX);
		},
		[handleMove],
	);

	const handleEnd = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleEnd);
			document.addEventListener("touchmove", handleTouchMove);
			document.addEventListener("touchend", handleEnd);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleEnd);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleEnd);
		};
	}, [handleMouseMove, handleTouchMove, isDragging]);

	return (
		<div
			className="imgsComparison"
			ref={containerRef}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			style={{ touchAction: isDragging ? "none" : "pan-y" }}
		>
			<div className="imageContainer">
				{/* Before image - всегда видна полностью */}
				<div className="imageBefore">
					<img src={imgs.before} alt="before" loading="lazy" />
				</div>

				{/* After image - обрезается справа */}
				<div
					className="imageAfter"
					style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
				>
					<img src={imgs.after} alt="after" loading="lazy" />
				</div>
			</div>

			{/* Slider handle */}
			<div className="sliderHandle" style={{ left: `${sliderPosition}%` }}>
				<div className="sliderLine" />
				<div className="sliderButton">
					<svg
						width="65"
						height="65"
						viewBox="0 0 65 65"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width="65" height="65" rx="32.5" fill="white" />
						<g clipPath="url(#clip0_9_354)">
							<path
								d="M44.5 26.5L43.4425 27.5575L47.6275 31.75H38.5V33.25H47.6275L43.435 37.435L44.5 38.5L50.5 32.5L44.5 26.5Z"
								fill="#292929"
							/>
						</g>
						<g clipPath="url(#clip1_9_354)">
							<path
								d="M20.5 26.5L21.5575 27.5575L17.3725 31.75H26.5V33.25H17.3725L21.565 37.435L20.5 38.5L14.5 32.5L20.5 26.5Z"
								fill="#292929"
							/>
						</g>
						<defs>
							<clipPath id="clip0_9_354">
								<rect
									width="18"
									height="18"
									fill="white"
									transform="matrix(0 1 -1 0 53.5 23.5)"
								/>
							</clipPath>
							<clipPath id="clip1_9_354">
								<rect
									width="18"
									height="18"
									fill="white"
									transform="matrix(0 1 1 0 11.5 23.5)"
								/>
							</clipPath>
						</defs>
					</svg>
				</div>
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
