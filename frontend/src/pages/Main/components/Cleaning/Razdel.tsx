import React from "react";
import MainButton from "../../../../components/Buttons/MainButton/MainButton";
import { NoSVG, YesSVG } from "./svg";

export type RazdelT = "kitchen" | "bathroom" | "total";

export type AboutAttribute = {
	attribute: string;
	hasExpress?: boolean | string;
	hasComfort?: boolean | string;
	hasElite?: boolean | string;
};

const razdelTemplates: Record<RazdelT, { name: string; description: string }> =
	{
		kitchen: {
			name: "КУХНЯ",
			description:
				"Мы знаем, как сложно представить кухню только по картинке. Поэтому делаем всё, чтобы вам было удобно:",
		},
		bathroom: { name: "ТУАЛЕТ", description: "Туааалеееет" },
		total: { name: "КОМНАТЫ", description: "Всеееееее" },
	};

const AllowAnnotation = ({ hasType }: { hasType?: boolean | string }) => {
	if (typeof hasType === "string") {
		return <>{hasType}</>;
	}
	return hasType ? <YesSVG /> : <NoSVG />;
};

export default function Razdel({
	attributes,
	razdel,
}: {
	attributes: AboutAttribute[];
	razdel: RazdelT;
}) {
	return (
		<div className="tableRazdel">
			<div>
				<span className="nameRazdel">{razdelTemplates[razdel].name}</span>
				<p className="descriptionRazdel">
					{razdelTemplates[razdel].description}
				</p>
			</div>
			<div className="tableWrapper">
				<div />
				<div className="oneRazdel">Экспресс</div>
				<div className="oneRazdel">Комфорт</div>
				<div className="oneRazdel">Элит</div>
				{attributes.map((attr, index) => (
					<React.Fragment key={index}>
						<div className="attrName">{attr.attribute}</div>
						<div className="oneRazdel">
							<AllowAnnotation hasType={attr.hasExpress} />
						</div>
						<div className="oneRazdel">
							<AllowAnnotation hasType={attr.hasComfort} />
						</div>
						<div className="oneRazdel">
							<AllowAnnotation hasType={attr.hasElite} />
						</div>
						{index === attributes.length - 1 ? null : (
							<div className="borderRowRazdel" />
						)}
					</React.Fragment>
				))}
			</div>
			<div>
				<MainButton className="sendApplication">Оставить заявку</MainButton>
			</div>
		</div>
	);
}
