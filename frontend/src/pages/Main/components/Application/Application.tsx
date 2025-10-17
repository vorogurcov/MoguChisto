import { FC, SVGProps } from "react";
import CleanerPicture from "./CleanerPicture";
import NameBrend from "./NameBrend";
import TextInput from "../../../../components/UI/Inputs/TextInput";
import Selection from "../../../../components/UI/Selections/Selection";
import MainButton from "../../../../components/Buttons/MainButton/MainButton";
import "./css.scss";

const FooterSVG: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		height="81"
		viewBox="0 0 1440 81"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="footerLine"
		{...props}
	>
		<path
			d="M0 23.1526C562.181 43.5552 868.021 -37.7664 1440 23.1526V81H0V23.1526Z"
			fill="#F9F9F9"
		/>
	</svg>
);

type CleaningType = "exrpess" | "comfort" | "elite" | "after fix";

const typesCleaning: { type: CleaningType; label: string }[] = [
	{ type: "exrpess", label: "Экспресс" },
	{ type: "comfort", label: "Комфорт" },
	{ type: "elite", label: "Элит" },
	{ type: "after fix", label: "После ремонта" },
];

export default function Application() {
	return (
		<div className="applicationContainer page-item">
			<main className="application">
				<div className="leftBlockApplication">
					<div className="nameBrend">
						<NameBrend />
					</div>
					<div>
						<div>
							<TextInput title="Жил. площадь" placeholder="20м²" />
						</div>
						<div>
							<Selection
								name="typeCleaning"
								title="Тип уборки"
								options={typesCleaning}
							/>
						</div>
						<div>
							<TextInput
								title="Номер телефона"
								placeholder="+7 (999) 999-99-99"
							/>
						</div>
					</div>
					<div>8 500 ₽</div>
					<div>
						<MainButton>Отправить заявку</MainButton>
						<MainButton>Узнать детали</MainButton>
					</div>
				</div>
				<div className="cleanerContainer">
					<CleanerPicture className="cleaner" />
				</div>
			</main>
			<footer>
				<FooterSVG className="applicationFooter" />
			</footer>
		</div>
	);
}
