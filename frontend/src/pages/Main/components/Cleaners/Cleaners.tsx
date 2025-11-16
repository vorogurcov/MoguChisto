import { FC, forwardRef, SVGProps } from "react";
import ScrollCards from "../../../../components/ScrollCards/ScrollCards";
import cleanerImg from "../../../../public/imgs/cleaners/cleaner.png";
import "./css.scss";
import Info from "../Title";
import PageItem from "../../../../components/PageItem";

const RateSVG: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="18"
		height="19"
		viewBox="0 0 18 19"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<g clipPath="url(#clip0_10_1330)">
			<path
				d="M9.63004 1.68864L11.6743 5.81578C11.7208 5.92054 11.794 6.01128 11.8865 6.07896C11.9789 6.14662 12.0876 6.18889 12.2015 6.2015L16.7143 6.87007C16.845 6.88686 16.9682 6.94049 17.0695 7.02469C17.1708 7.10888 17.2462 7.22017 17.2866 7.34554C17.3271 7.47092 17.3309 7.60523 17.2979 7.73276C17.265 7.8603 17.1963 7.9758 17.1 8.06578L13.8471 11.2929C13.7642 11.3705 13.7019 11.4676 13.666 11.5754C13.63 11.6832 13.6216 11.7982 13.6414 11.9101L14.4257 16.4486C14.4485 16.5791 14.4341 16.7132 14.3843 16.8358C14.3346 16.9585 14.2514 17.0647 14.1441 17.1425C14.037 17.2201 13.9101 17.2662 13.7781 17.2754C13.6461 17.2846 13.514 17.2565 13.3971 17.1943L9.33432 15.0472C9.2303 14.9961 9.11593 14.9696 9.00004 14.9696C8.88414 14.9696 8.76979 14.9961 8.66575 15.0472L4.60289 17.1943C4.48601 17.2565 4.35403 17.2846 4.22198 17.2754C4.08992 17.2662 3.96308 17.2201 3.85592 17.1425C3.74874 17.0647 3.66553 16.9585 3.61575 16.8358C3.56598 16.7132 3.55162 16.5791 3.57432 16.4486L4.35861 11.8586C4.37849 11.7468 4.37008 11.6317 4.33415 11.5239C4.29823 11.4162 4.23591 11.3191 4.15289 11.2415L0.86147 8.06578C0.764094 7.97334 0.695613 7.85463 0.664324 7.72407C0.633035 7.59349 0.640281 7.45664 0.685182 7.3301C0.730084 7.20356 0.810715 7.09276 0.91731 7.0111C1.0239 6.92946 1.15189 6.88046 1.28575 6.87007L5.79861 6.2015C5.91252 6.18889 6.02114 6.14662 6.11363 6.07896C6.20613 6.01128 6.27926 5.92054 6.32575 5.81578L8.37004 1.68864C8.42571 1.56844 8.5146 1.46667 8.62624 1.39535C8.73787 1.32403 8.86757 1.28613 9.00004 1.28613C9.1325 1.28613 9.26222 1.32403 9.37385 1.39535C9.48547 1.46667 9.57436 1.56844 9.63004 1.68864Z"
				fill="#FFC130"
				stroke="#FFC130"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
		<defs>
			<clipPath id="clip0_10_1330">
				<rect
					width="18"
					height="18"
					fill="white"
					transform="translate(0 0.287109)"
				/>
			</clipPath>
		</defs>
	</svg>
);

type CardT = {
	name: string;
	rate: number;
	description?: string;
	img?: string;
};

const cards: CardT[] = [
	{
		name: "Анна М.",
		rate: 4.9,
		description: "Ответственная, знающая толк в своем деле.",
		img: cleanerImg,
	},
	{
		name: "Анна М.",
		rate: 4.9,
		description: "Ответственная, знающая толк в своем деле.",
		img: cleanerImg,
	},
	{
		name: "Анна М.",
		rate: 4.9,
		description: "Ответственная, знающая толк в своем деле.",
		img: cleanerImg,
	},
	{
		name: "Анна М.",
		rate: 4.9,
		description: "Ответственная, знающая толк в своем деле.",
		img: cleanerImg,
	},
	{
		name: "Анна М.",
		rate: 4.9,
		description: "Ответственная, знающая толк в своем деле.",
		img: cleanerImg,
	},
];

function OneCard({ name, rate, description, img }: CardT) {
	return (
		<div className="cardCleaner">
			<div className="name attr">
				<b>{name}</b>
			</div>
			<div className="rate attr">
				<RateSVG />
				{rate}
			</div>
			<div className="descriptionCleanerCard attr">{description}</div>
			<div className="img">
				<img src={img} alt="" />
			</div>
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
