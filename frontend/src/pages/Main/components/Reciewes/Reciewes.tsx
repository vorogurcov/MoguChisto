import { FC, SVGProps, useState } from "react";
import ScrollCards from "../../../../components/ScrollCards/ScrollCards";
import Info from "../Title";
import photo from "./photo.jpg";
import { GoogleSVG, YandexSVG } from "./svg";
import "./css.scss";
import { RateStarSVG, StarSVG } from "../../../../public/svg";
import ButtonWithBottomLine from "../../../../components/Buttons/ButtonWithBottomLine/ButtonWithBottomLine";

type RecieweT = {
	photo?: string;
	text: string;
	name: string;
};

const cards: RecieweT[] = [
	{
		name: "Светлана Р.",
		text: `Вся техника полностью встроенная для экономии пространства. 
Максимально  эффективно использовать угол кухни, сделав его легко-доступным местом для дополнительного хранения. 
Установка измельчителя мусора и системы фильтрации воды. Вся техника полностью встроенная для экономии пространства. 
Максимально  эффективно использовать угол кухни, сделав его легко-доступным местом для дополнительного хранения. 
Установка измельчителя мусора и системы фильтрации воды. Вся техника полностью встроенная для экономии пространства. 
Максимально  эффективно использовать угол кухни, сделав его легко-доступным местом для дополнительного хранения. 
Установка измельчителя мусора и системы фильтрации воды. Вся техника полностью встроенная для экономии пространства. 
Максимально  эффективно использовать угол кухни, сделав его легко-доступным местом для дополнительного хранения. 
Установка измельчителя мусора и системы фильтрации воды.`,
		photo: photo,
	},
	{
		name: "Светлана Р.",
		text: `Вся техника полностью встроенная для экономии пространства. 
Максимально  эффективно использовать угол кухни, сделав его легко-доступным местом для дополнительного хранения. 
Установка измельчителя мусора и системы фильтрации воды.`,
		photo: photo,
	},
	{
		name: "Светлана Р.",
		text: `Вся техника полностью встроенная для экономии пространства. 
Максимально  эффективно использовать угол кухни, сделав его легко-доступным местом для дополнительного хранения. 
Установка измельчителя мусора и системы фильтрации воды.`,
		photo: photo,
	},
	{
		name: "Светлана Р.",
		text: `Вся техника полностью встроенная для экономии пространства. 
Максимально  эффективно использовать угол кухни, сделав его легко-доступным местом для дополнительного хранения. 
Установка измельчителя мусора и системы фильтрации воды.`,
		photo: photo,
	},
	{
		name: "Светлана Р.",
		text: `Вся техника полностью встроенная для экономии пространства. 
Максимально  эффективно использовать угол кухни, сделав его легко-доступным местом для дополнительного хранения. 
Установка измельчителя мусора и системы фильтрации воды.`,
		photo: photo,
	},
	{
		name: "Светлана Р.",
		text: `Вся техника полностью встроенная для экономии пространства. 
Максимально  эффективно использовать угол кухни, сделав его легко-доступным местом для дополнительного хранения. 
Установка измельчителя мусора и системы фильтрации воды.`,
	},
];

function OneReciewe({ photo, text, name }: RecieweT) {
	const [isPreview, setIsPreview] = useState(!!photo);
	return (
		<div className="oneReciewe">
			<div className="namePanelReciewe">
				<span className="nameReciewer">{name}</span>
				{photo && (
					<ButtonWithBottomLine onClick={() => setIsPreview((prev) => !prev)}>
						{isPreview ? "Читать отзыв" : "Закрыть отзыв"}
					</ButtonWithBottomLine>
				)}
			</div>
			<div className="recieweContent">
				<div className={`card-inner ${isPreview ? "" : "flipped"}`}>
					<div className="front">
						<img src={photo} alt="photo" />
					</div>

					<div className="back">
						<div className="avatarReciewer">avatar</div>
						<div className="reciewerText">
							{text.split("\n").map((paragraph, index) => (
								<p key={index}>{paragraph}</p>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Reciewes() {
	return (
		<div className="reciewes page-item">
			<Info>
				<span className="rateReciewes">
					Честная оценка <span className="numberRate">4.9</span>
				</span>
				<div className="maps">
					<div>
						<YandexSVG />
						<RateStarSVG />
						4.9
					</div>
					<div>
						<GoogleSVG />
						<RateStarSVG />
						4.9
					</div>
				</div>
			</Info>
			<ScrollCards>
				{cards.map((card, index) => (
					<OneReciewe key={index} {...card} />
				))}
			</ScrollCards>
		</div>
	);
}
