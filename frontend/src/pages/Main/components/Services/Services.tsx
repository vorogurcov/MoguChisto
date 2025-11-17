import { forwardRef, ReactNode, useState } from "react";
import Razdel, { AboutAttribute, RazdelT } from "./Razdel";
import "./css.scss";
import { BathroomSVG, KitchenSVG, TotalSVG } from "./svg";
import PageItem from "../../../../components/PageItem";
import useWindowWidth from "../../../../hooks/useWindowWidth";
import classNames from "classnames";
import { useActiveSectionContext } from "../../../../hooks/ActiveSectionContext";
import { PagePart } from "../../../../components/NavigatePanel/NavigatePanel";

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
	],
	total: [
		{
			attribute: "Мытьё полов",
			comfort: "+ Отодвигаем мебель. Пятновыведение",
			elite:
				"+ Отодвигаем мебель. Пятновыведение любой сложности. Очистка углов и стыков",
			express: "Пылесос, мытьё пола и открытых плинтусов",
		},
		{
			attribute: "Протирка поверхностей",
			comfort:
				"Открыте полки, фасады, подоконники, столы полностью торшеры и настольные светильники, двери (в том числе входные). Пятновыведение",
			elite:
				"Открыте полки, шкафы и шкафчики полностью, подоконники, столы полностью торшеры и настольные светильники, двери (в том числе входные). Пятновыведение",
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
				"Аккуратно сложим вещи на стул или диван + аккуратно расставим обувь",
			elite: "Развешаем вещи в шкафы по указаниям клиента",
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
			elite: "Одна позиция мебели бесплатно, остальные со скидкой 50%",
			express: undefined,
		},
		{
			attribute: "Особые случаи",
			express: undefined,
			comfort: undefined,
			elite: "Любые возможные случаи: прорыв канализации, после стройки и тд",
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
	const [razdel, setRazdel] = useState<RazdelT>("total");
	const width = useWindowWidth();
	const context = useActiveSectionContext();
	const handleSetRazdel = (razdel: RazdelT) => {
		setRazdel(razdel);
		context?.setActiveSection(PagePart.service);
		context?.setShouldSmooth(true);
	};
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
								onClick={() => handleSetRazdel("total")}
							/>
							<BathroomSVG
								className="svgButton"
								active={razdel === "bathroom"}
								onClick={() => handleSetRazdel("bathroom")}
							/>
							<KitchenSVG
								className="svgButton"
								active={razdel === "kitchen"}
								onClick={() => handleSetRazdel("kitchen")}
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
