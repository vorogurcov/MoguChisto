import { FC, forwardRef, SVGProps } from "react";
import PageItem from "../../../../components/PageItem";
import Info from "../Title";
import MainButton from "../../../../components/Buttons/MainButton/MainButton";
import { FooterSVG, WhatsApp } from "../../../../public/svg";
import { CleanerSVG } from "./CleanerSVG";
import "./css.scss";
import ButtonWithBottomLine from "../../../../components/Buttons/ButtonWithBottomLine/ButtonWithBottomLine";

const SVG: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="47"
		height="46"
		viewBox="0 0 47 46"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<rect width="46" height="46" rx="23" stroke="#939393" />
		<rect x="2" y="2" width="42" height="42" rx="21" fill="#939393" />
		<g clipPath="url(#clip0_22_5890)">
			<path
				d="M28.25 16.25H25.115C24.8 15.38 23.975 14.75 23 14.75C22.025 14.75 21.2 15.38 20.885 16.25H17.75C16.925 16.25 16.25 16.925 16.25 17.75V28.25C16.25 29.075 16.925 29.75 17.75 29.75H28.25C29.075 29.75 29.75 29.075 29.75 28.25V17.75C29.75 16.925 29.075 16.25 28.25 16.25ZM23 16.25C23.4125 16.25 23.75 16.5875 23.75 17C23.75 17.4125 23.4125 17.75 23 17.75C22.5875 17.75 22.25 17.4125 22.25 17C22.25 16.5875 22.5875 16.25 23 16.25ZM24.5 26.75H19.25V25.25H24.5V26.75ZM26.75 23.75H19.25V22.25H26.75V23.75ZM26.75 20.75H19.25V19.25H26.75V20.75Z"
				fill="white"
			/>
		</g>
		<defs>
			<clipPath id="clip0_22_5890">
				<rect
					width="18"
					height="18"
					fill="white"
					transform="translate(14 14)"
				/>
			</clipPath>
		</defs>
	</svg>
);

const Hh = () => <div className="hh">hh</div>;

function Part({ children }: { children: string }) {
	return (
		<div className="partContainer">
			<SVG className="svg" />
			<span className="part">{children}</span>
		</div>
	);
}

const parts = [
	"Сами выбираете, когда вам удобно работать",
	"Работа рядом с домом",
	"Повышаем по службе ответственных клинеров",
	"На первых уборках поможет наставник",
];

const JobSuggestion = forwardRef<HTMLDivElement>((_, ref) => {
	return (
		<PageItem className="JobSuggestion">
			<Info>
				<span ref={ref}>
					<b>Всегда открыты к сотрудничеству</b>
				</span>
			</Info>
			<div className="titleParts">
				<b>4 причины работать у нас:</b>
			</div>
			{parts.map((part) => (
				<Part key={part}>{part}</Part>
			))}
			<div className="buttons">
				<ButtonWithBottomLine>Требования</ButtonWithBottomLine>
				<ButtonWithBottomLine>Комфортные условия</ButtonWithBottomLine>
			</div>
			<div className="sourcesMess">
				<MainButton className="writeButton">
					Написать в WhatsApp
					<WhatsApp className="whatsapp" fill="white" />
				</MainButton>
				<Hh />
			</div>
			<CleanerSVG className="cleanerSvg" />
			<footer>
				<FooterSVG fill="white" className="footerJob" />
			</footer>
		</PageItem>
	);
});
JobSuggestion.displayName = "JobSuggestion";
export default JobSuggestion;
