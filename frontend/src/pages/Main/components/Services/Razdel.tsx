import React, { forwardRef, useState } from "react";
import MainButton from "../../../../components/Buttons/MainButton/MainButton";
import { NoSVG, YesSVG } from "./svg";
import { PagePart } from "../../../../components/NavigatePanel/NavigatePanel";
import { useActiveSectionContext } from "../../../../hooks/ActiveSectionContext";
import useWindowWidth from "../../../../hooks/useWindowWidth";
import { CleaningType, typesCleaning } from "../Application/Application";
import ButtonLikeText from "../../../../components/Buttons/ButtonLikeText/ButtonLikeText";
import classNames from "classnames";

export type RazdelT = "kitchen" | "bathroom" | "total";

export type AboutAttribute = {
	attribute: string;
} & Record<CleaningType, boolean | string | undefined>;

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

const DesctopRazdel = forwardRef<
	HTMLDivElement,
	{
		attributes: AboutAttribute[];
		razdel: RazdelT;
	}
>(({ attributes, razdel }, ref) => {
	const contextSection = useActiveSectionContext();
	return (
		<div className="tableRazdel">
			<div ref={ref}>
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
							<AllowAnnotation hasType={attr.exrpess} />
						</div>
						<div className="oneRazdel">
							<AllowAnnotation hasType={attr.comfort} />
						</div>
						<div className="oneRazdel">
							<AllowAnnotation hasType={attr.elite} />
						</div>
						{index === attributes.length - 1 ? null : (
							<div className="borderRowRazdel" />
						)}
					</React.Fragment>
				))}
			</div>
			<div>
				<MainButton
					className="sendApplication"
					onClick={() => {
						contextSection?.setActiveSection(PagePart.top);
						contextSection?.setShouldSmooth(true);
					}}
				>
					Оставить заявку
				</MainButton>
			</div>
		</div>
	);
});
DesctopRazdel.displayName = "DesctopRazdel";

const MobileRazdel = forwardRef<
	HTMLDivElement,
	{
		attributes: AboutAttribute[];
		razdel: RazdelT;
	}
>(({ attributes, razdel }, ref) => {
	const contextSection = useActiveSectionContext();
	const [typeCleaningActive, setTypeCleaningActive] =
		useState<CleaningType>("exrpess");
	return (
		<div className="tableRazdel">
			<div ref={ref}>
				<span className="nameRazdel">{razdelTemplates[razdel].name}</span>
				<p className="descriptionRazdel">
					{razdelTemplates[razdel].description}
				</p>
			</div>
			<div className="tableWrapperMobile">
				<div className="switchRazdels">
					{typesCleaning.map((type) => (
						<ButtonLikeText
							key={type.type}
							className={classNames("switchRazdel", {
								activeSwitchRazdel: type.type === typeCleaningActive,
							})}
							onClick={() => setTypeCleaningActive(type.type)}
						>
							{type.label}
						</ButtonLikeText>
					))}
				</div>
				<div className="tableMobile">
					{attributes.map((attr, index) => (
						<React.Fragment key={index}>
							<div className="attrName">{attr.attribute}</div>
							<div className={classNames("oneRazdel", "attrHas")}>
								<AllowAnnotation hasType={attr[typeCleaningActive]} />
							</div>
							{index === attributes.length - 1 ? null : (
								<div className="borderRowRazdelMobile" />
							)}
						</React.Fragment>
					))}
				</div>
			</div>
			<div>
				<MainButton
					className="sendApplication"
					onClick={() => {
						contextSection?.setActiveSection(PagePart.top);
						contextSection?.setShouldSmooth(true);
					}}
				>
					Оставить заявку
				</MainButton>
			</div>
		</div>
	);
});
MobileRazdel.displayName = "MobileRazdel";

const Razdel = forwardRef<
	HTMLDivElement,
	{
		attributes: AboutAttribute[];
		razdel: RazdelT;
	}
>(({ ...props }, ref) => {
	const width = useWindowWidth();
	return width > 750 ? (
		<DesctopRazdel ref={ref} {...props} />
	) : (
		<MobileRazdel ref={ref} {...props} />
	);
});
Razdel.displayName = "Razdel";
export default Razdel;
