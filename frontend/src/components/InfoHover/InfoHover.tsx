import { FC, SVGProps, useRef, useState } from "react";

const InfoSVG: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<g clipPath="url(#clip0_79_7867)">
			<path
				d="M7.99999 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8.00001C14.6667 4.31811 11.6819 1.33334 7.99999 1.33334C4.3181 1.33334 1.33333 4.31811 1.33333 8.00001C1.33333 11.6819 4.3181 14.6667 7.99999 14.6667Z"
				stroke="#292929"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8 10.6667V8"
				stroke="#292929"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8 5.33334H8.0075"
				stroke="#292929"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
		<defs>
			<clipPath id="clip0_79_7867">
				<rect width="16" height="16" fill="white" />
			</clipPath>
		</defs>
	</svg>
);

export default function InfoHover({ infoStrings }: { infoStrings: string[] }) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleMouseEnter = () => {
		setIsOpen(true); // Показываем панель
	};

	const handleMouseLeave = () => {
		setIsOpen(false); // Скрываем панель
	};
	return (
		<div className="infoHover">
			<InfoSVG
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			/>
			{isOpen && (
				<div className="hoverPanel">
					{infoStrings.map((str, index) => (
						<p key={index}>{str}</p>
					))}
				</div>
			)}
		</div>
	);
}
