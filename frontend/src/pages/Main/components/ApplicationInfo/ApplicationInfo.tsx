import { forwardRef, ReactElement, SVGProps, useState } from "react";
import { CacheSVG, CloudSVG, PersonSVG, RaketSVG, TimeSVG } from "./SVG";
import classNames from "classnames";
import MainButton from "../../../../components/Buttons/MainButton/MainButton";
import "./css.scss";
import { ButtonPropsType } from "../../../../components/Buttons/ButtonPropsTypeAlias";
import CardInfoPanel from "../../../../components/CardInfoPanel/CardInfoPanel";
import CardItemInfo from "../../../../components/CardItemInfo/CardItemInfo";
import { FooterSVG, MiniCleanerSVG } from "../../../../public/svg";
import PageItem from "../../../../components/PageItem";

type WidgetT = {
	title: string;
	SVG: (props?: SVGProps<SVGSVGElement>) => ReactElement;
	className?: string;
};

function Widget({ title, SVG, className }: WidgetT) {
	return (
		<div className={classNames("widget", className)}>
			<div className="widgetContent">
				<div>
					<b>{title}</b>
				</div>
				<SVG />
			</div>
		</div>
	);
}

const widgets: WidgetT[] = [
	{
		title: "Работаем с проверенными клинерами",
		SVG: (props?: SVGProps<SVGSVGElement>) => <PersonSVG {...props} />,
	},
	{
		title: "Оплата — после уборки",
		SVG: (props?: SVGProps<SVGSVGElement>) => <CacheSVG {...props} />,
	},
	{
		title: "Уборка за 1 день",
		SVG: (props?: SVGProps<SVGSVGElement>) => <TimeSVG {...props} />,
	},
	{
		title: "Выезжаем в любой район города",
		SVG: (props?: SVGProps<SVGSVGElement>) => <RaketSVG {...props} />,
	},
];

type TarifT = {
	price: number;
	countCleaner: string;
	time: string;
	square: number;
};

type TarifNames = "Экспресс" | "Комфорт" | "Элит";

const tarifs: Record<TarifNames, TarifT[]> = {
	Экспресс: [
		{ square: 20, price: 4250, countCleaner: "1", time: "2 - 4 часа" },
		{ square: 40, price: 4950, countCleaner: "1 - 2", time: "2 - 4 часа" },
		{ square: 60, price: 5650, countCleaner: "1", time: "2 - 4 часа" },
	],
	Комфорт: [{ square: 20, price: 4250, countCleaner: "1", time: "2 - 4 часа" }],
	Элит: [{ square: 20, price: 4250, countCleaner: "1", time: "2 - 4 часа" }],
};

function OneTarif({ square, price, countCleaner, time }: TarifT) {
	return (
		<div className="OneTarif">
			<CardInfoPanel>
				<CardItemInfo>{price}₽</CardItemInfo>
				<CardItemInfo>
					<MiniCleanerSVG className="svg" />
					{countCleaner}
				</CardItemInfo>
				<CardItemInfo>{time}</CardItemInfo>
			</CardInfoPanel>
			<div className="square">{square}м²</div>
			<CloudSVG className="cloud" />
		</div>
	);
}

function OneButton({ children, className, ...props }: ButtonPropsType) {
	return (
		<MainButton className={classNames("oneTarifButton", className)} {...props}>
			{children}
		</MainButton>
	);
}

function Tarifs() {
	const [selected, setSelected] = useState<TarifNames>("Экспресс");
	return (
		<div className="tarifs">
			<div className="tarifButtons">
				{Object.keys(tarifs).map((tarif) => (
					<OneButton
						key={tarif}
						onClick={() => setSelected(tarif as TarifNames)}
						className={selected === tarif ? "active" : ""}
					>
						{tarif}
					</OneButton>
				))}
			</div>
			<div className="tarifCards">
				{tarifs[selected].map((tarif, index) => (
					<OneTarif key={index} {...tarif} />
				))}
			</div>
		</div>
	);
}

const ApplicationInfo = forwardRef<HTMLDivElement>((_, ref) => {
	return (
		<PageItem className="applicatioInfo">
			<div ref={ref} className="titles">
				<div className="title">
					<h1>
						Современный или классический дизайн? Для квартиры, студии или
						загородного дома?
					</h1>
					<span>Выполним свою работу профессионально.</span>
					<div>
						<MainButton className="button">Оставить заявку</MainButton>
					</div>
				</div>
				<div className="widgets">
					{widgets.map((widget, index) => (
						<Widget
							key={index}
							{...widget}
							className={
								index === 0 || index === 3 ? `longerWidget-${index}` : ""
							}
						/>
					))}
				</div>
			</div>
			<Tarifs />
			<footer>
				<FooterSVG />
			</footer>
		</PageItem>
	);
});
ApplicationInfo.displayName = "ApplicationInfo";
export default ApplicationInfo;
