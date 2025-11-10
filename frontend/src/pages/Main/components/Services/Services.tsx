import { forwardRef, ReactNode, useState } from "react";
import Razdel, { AboutAttribute, RazdelT } from "./Razdel";
import "./css.scss";
import { BathroomSVG, KitchenSVG, TotalSVG } from "./svg";
import PageItem from "../../../../components/PageItem";
import useWindowWidth from "../../../../hooks/useWindowWidth";
import classNames from "classnames";

const razdels: Record<RazdelT, AboutAttribute[]> = {
	kitchen: [
		{
			attribute: "Мытьё посуды и раковины",
			comfort: true,
			elite: true,
			express: true,
		},
		{
			attribute: "Рабочая зона",
			comfort: true,
			elite: true,
			express: true,
		},
		{
			attribute: "Фартук",
			comfort: true,
			elite: true,
			express: true,
		},
		{
			attribute: "Вытяжка",
			comfort: true,
			elite: true,
			express: undefined,
		},
		{
			attribute: "Варочная панель",
			comfort: true,
			elite: true,
			express: true,
		},
		{
			attribute: "Бытовая техника (духовой шкаф, СВЧ, холодильник, чайник)",
			comfort: "Снаружи и внутри стеклянных дверц",
			elite: "Полная чистка",
			express: undefined,
		},
		{
			attribute: "Гарнитур, пол и плинтуса, пространство под кухней, мусор",
			comfort: "+ очистка углов и стыков пароочистителем",
			elite: "+ пятновыведение, отодвигая мебель",
			express: "Пылесос, мытьё пола и открытых плинтусов",
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

const Services = forwardRef<HTMLDivElement>((_, ref) => {
	const [razdel, setRazdel] = useState<RazdelT>("kitchen");
	const width = useWindowWidth();
	return (
		<PageItem className="razdel">
			<DifficueltShadowsWrapper>
				<div
					className={classNames("contentRazdel", {
						contentRazdelMobile: width < 900,
					})}
				>
					<div
						className={classNames("panelRazdel", {
							panelRazdelMobile: width < 900,
						})}
					>
						<div className="buttonsRazdel">
							<TotalSVG
								className="svgButton"
								active={razdel === "total"}
								onClick={() => setRazdel("total")}
							/>
							<BathroomSVG
								className="svgButton"
								active={razdel === "bathroom"}
								onClick={() => setRazdel("bathroom")}
							/>
							<KitchenSVG
								className="svgButton"
								active={razdel === "kitchen"}
								onClick={() => setRazdel("kitchen")}
							/>
						</div>
					</div>
					<Razdel ref={ref} attributes={razdels[razdel]} razdel={razdel} />
				</div>
			</DifficueltShadowsWrapper>
		</PageItem>
	);
});
Services.displayName = "Cleaning";
export default Services;
