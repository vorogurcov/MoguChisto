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
			comfort: "В соответствии с разделом общее",
			elite: "В соответствии с разделом общее",
			express: "В соответствии с разделом общее",
		},
	],
	bathroom: [
		{
			attribute: "Пол",
			comfort: "В соответствии с разделом общее",
			elite: "В соответствии с разделом общее",
			express: "В соответствии с разделом общее",
		},
		{
			attribute: "Стены",
			comfort: "Зоны с видимыми загрязнениями",
			elite: "Полное мытьё + очистка швов",
			express: undefined,
		},
		{
			attribute: "Сантехника",
			comfort: "Уборка спец средством до блеска",
			elite: "Уборка спец средством до блеска",
			express: "Уборка спец средством",
		},
		{
			attribute: "Унитаз",
			comfort: "+ освежающие таблетки в бачок",
			elite: "+ освежающие таблетки в бачок и отбеливание пластика",
			express: true,
		},
		{
			attribute: "Бытовая техника",
			comfort:
				"Снаружи и внутри + прочистка стиральной машины при помощи специальной таблетки",
			elite:
				"Снаружи и внутри + прочистка стиральной машины при помощи специальной таблетки",
			express: "Снаружи",
		},
		{
			attribute: "Фурнитура",
			comfort: true,
			elite: true,
			express: true,
		},
		{
			attribute: "Мебель",
			comfort: "В соответствии с разделом общее",
			elite: "В соответствии с разделом общее",
			express: "В соответствии с разделом общее",
		},
	],
	total: [
		{
			attribute: "Мытьё полов",
			comfort: "+ очистка углов и стыков пароочистителем",
			elite: "+ пятновыведение, отодвигая мебель",
			express: "Пылесос, мытьё пола и открытых плинтусов",
		},
		{
			attribute: "Протирка поверхностей",
			comfort:
				"Открыте полки, шкафы и шкафчики полностью (при отсутствии вещей внутри или только снаружи), подоконники, столы полностью торшеры и настольные светильники, двери (в том числе входные). Пятновыведение",
			elite:
				"Открыте полки, шкафы и шкафчики полностью (при отсутствии вещей внутри или только снаружи), подоконники, столы полностью торшеры и настольные светильники, двери (в том числе входные). Пятновыведение",
			express:
				"Открытые полки, подоконники, столы (рабочая зона), двери (кроме входных)",
		},
		{
			attribute: "Сборка мусора",
			comfort: "Собираем мусор, выносим и меняем мешки в мусорке",
			elite: "Собираем мусор, выносим и меняем мешки в мусорке",
			express: "Собираем мусор, выносим и меняем мешки в мусорке",
		},
		{
			attribute: "Раскладывание вещей",
			comfort:
				"Развешаем вещи в шкафы по указаниям клиента + аккуратно расставим обувь",
			elite:
				"Гладим и развешаем вещи в шкафы по указаниям клиента. Можем разложить вещи самостоятельно при согласии клиента + аккуратно расставим обувь",
			express:
				"Аккуратно сложим вещи на стул или диван + аккуратно расставим обувь",
		},
		{
			attribute: "Зеркала и зеркальные поверхности",
			comfort: "Мытьё спец средством",
			elite: "Мытьё спец средством",
			express: "Мытьё спец средством",
		},
		{
			attribute: "Окна",
			comfort: "Полное мытьё окон (кроме панорамных и труднодоступных)",
			elite:
				"Полное мытьё окон (при возможности доступа без промышленного альпиниста)",
			express: undefined,
		},
		{
			attribute: "Радиаторы",
			comfort: "Видимые участки",
			elite: "Полное мытьё ",
			express: undefined,
		},

		{
			attribute: "Химчистка мебели",
			comfort: undefined,
			elite:
				"Химчистка мягкой мебели, матрасов и ковров (клиент сам выбирает что нужно почистить. Цена не изменяется от количества)",
			express: undefined,
		},
	],
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
