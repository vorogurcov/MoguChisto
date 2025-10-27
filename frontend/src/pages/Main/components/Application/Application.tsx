import { useState } from "react";
import CleanerPicture from "./CleanerPicture";
import TextInput from "../../../../components/UI/Inputs/TextInput";
import Selection from "../../../../components/UI/Selections/Selection";
import MainButton from "../../../../components/Buttons/MainButton/MainButton";
import "./css.scss";
import { FooterSVG, NameBrend } from "../../../../public/svg";
import PageItem from "../../../../components/PageItem";

type CleaningType = "exrpess" | "comfort" | "elite" | "after fix";

const typesCleaning: { type: CleaningType; label: string }[] = [
	{ type: "exrpess", label: "Экспресс" },
	{ type: "comfort", label: "Комфорт" },
	{ type: "elite", label: "Элит" },
	{ type: "after fix", label: "После ремонта" },
];
type CleaningOption = (typeof typesCleaning)[0];

export default function Application() {
	const [value, setValue] = useState<CleaningOption>(typesCleaning[0]);
	return (
		<PageItem className="applicationContainer">
			<main className="application">
				<div className="leftBlockApplication">
					<div className="nameBrend">
						<NameBrend />
					</div>
					<div className="applicationParts">
						<TextInput
							title="Жил. площадь"
							placeholder="20м²"
							classNameContainer="applicationPart"
						/>
						<Selection
							name="typeCleaning"
							title="Тип уборки"
							options={typesCleaning}
							classNameContainer="applicationPart"
							value={value}
							onChange={(newValue) => setValue(newValue as CleaningOption)}
						/>
						<TextInput
							title="Номер телефона"
							placeholder="+7 (999) 999-99-99"
							classNameContainer="applicationPart"
						/>
					</div>
					<div className="price">8 500 ₽</div>
					<div className="buttonsApplication">
						<MainButton className="send">Отправить заявку</MainButton>
						<MainButton className="more">Узнать детали</MainButton>
					</div>
				</div>
				<div className="cleanerContainer">
					<CleanerPicture className="cleaner" />
				</div>
			</main>
			<footer>
				<FooterSVG />
			</footer>
		</PageItem>
	);
}
