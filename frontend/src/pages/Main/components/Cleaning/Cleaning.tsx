import { ReactNode, useState } from "react";
import Razdel, { AboutAttribute, RazdelT } from "./Razdel";
import "./css.scss";
import { BathroomSVG, KitchenSVG, TotalSVG } from "./svg";
import PageItem from "../../../../components/PageItem";

const razdels: Record<RazdelT, AboutAttribute[]> = {
	kitchen: [
		{
			attribute: "Мытьё посуды и раковины",
			hasComfort: true,
			hasElite: true,
			hasExpress: true,
		},
		{
			attribute: "Рабочая зона",
			hasComfort: true,
			hasElite: true,
			hasExpress: true,
		},
		{
			attribute: "Фартук",
			hasComfort: true,
			hasElite: true,
			hasExpress: true,
		},
		{
			attribute: "Вытяжка",
			hasComfort: true,
			hasElite: true,
		},
		{
			attribute: "Варочная панель",
			hasComfort: true,
			hasElite: true,
			hasExpress: true,
		},
		{
			attribute: "Бытовая техника (духовой шкаф, СВЧ, холодильник, чайник)",
			hasComfort: "Снаружи и внутри стеклянных дверц",
			hasElite: "Полная чистка",
		},
		{
			attribute: "Гарнитур, пол и плинтуса, пространство под кухней, мусор",
			hasComfort: "+ очистка углов и стыков пароочистителем",
			hasElite: "+ пятновыведение, отодвигая мебель",
			hasExpress: "Пылесос, мытьё пола и открытых плинтусов",
		},
	],
	bathroom: [],
	total: [],
};

const DifficueltShadowsWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<div className="firstShadow">
			<div className="secondShadow">{children}</div>
		</div>
	);
};

export default function Cleaning() {
	const [razdel, setRazdel] = useState<RazdelT>("kitchen");
	return (
		<PageItem className="razdel">
			<DifficueltShadowsWrapper>
				<div className="contentRazdel">
					<div className="panelRazdel">
						<div className="buttonsRazdel">
							<TotalSVG className="svgButton" />
							<BathroomSVG className="svgButton" />
							<KitchenSVG className="svgButton" />
						</div>
					</div>
					<Razdel attributes={razdels[razdel]} razdel={razdel} />
				</div>
			</DifficueltShadowsWrapper>
		</PageItem>
	);
}
