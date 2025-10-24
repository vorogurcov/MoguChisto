import { ReactElement, SVGProps } from "react";
import { CacheSVG, PersonSVG, RaketSVG, TimeSVG } from "./SVG";
import classNames from "classnames";
import MainButton from "../../../../components/Buttons/MainButton/MainButton";
import "./css.scss";

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

export default function ApplicationInfo() {
	return (
		<div className="page-item applicatioInfo">
			<div className="titles">
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
			<div></div>
		</div>
	);
}
