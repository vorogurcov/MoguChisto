import { forwardRef, useMemo } from "react";
import CleanerPicture from "./CleanerPicture";
import TextInput, {
	isValidNumber,
} from "../../../../components/UI/Inputs/TextInput";
import Selection from "../../../../components/UI/Selections/Selection";
import MainButton from "../../../../components/Buttons/MainButton/MainButton";
import "./css.scss";
import { FooterSVG, NameBrend } from "../../../../public/svg";
import PageItem from "../../../../components/PageItem";
import { Controller, useForm } from "react-hook-form";
import calculatorPrice from "../../../../helpers/calculatorPrice";
import { useActiveSectionContext } from "../../../../hooks/ActiveSectionContext";
import { PagePart } from "../../../../components/NavigatePanel/NavigatePanel";
import useWindowWidth from "../../../../hooks/useWindowWidth";
import classNames from "classnames";

export type CleaningType = "exrpess" | "comfort" | "elite";

export const typesCleaning: { type: CleaningType; label: string }[] = [
	{ type: "exrpess", label: "Экспресс" },
	{ type: "comfort", label: "Комфорт" },
	{ type: "elite", label: "Элит" },
];
type CleaningOption = (typeof typesCleaning)[0];

type FormT = {
	square: number;
	typeCleaning: CleaningOption;
	phone: string;
};

const prompts = [
	"Студия - 0-29 м",
	"1 комн. - 30-49 м",
	"2 комн. - 50-69 м",
	"3 комн. - 70-99 м",
	"4 комн. - 100-149 м",
];

const Application = forwardRef<HTMLDivElement>((_, ref) => {
	const contextSection = useActiveSectionContext();

	const { register, watch, control, ...form } = useForm<FormT>({
		defaultValues: { typeCleaning: typesCleaning[0] },
		mode: "onBlur",
	});
	const { isSubmitting, isValid, errors } = form.formState;
	const formValues = watch();

	const onSubmit = (data: FormT) => {
		console.log("data", data);
	};

	const price = useMemo(
		() =>
			formValues.square && formValues.typeCleaning.type
				? calculatorPrice(
						Number(formValues.square),
						formValues.typeCleaning.type,
					)
				: undefined,
		[formValues.square, formValues.typeCleaning],
	);
	const width = useWindowWidth();
	return (
		<PageItem className="applicationContainer">
			<main className="application">
				<div
					className={classNames("leftBlockApplication", {
						leftBlockApplicationMobile: width < 900,
					})}
				>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div ref={ref} className="nameBrend">
							<NameBrend />
						</div>
						<div className="applicationParts">
							<TextInput
								{...register("square", {
									required: "Площадь обязательна",
									valueAsNumber: true,
								})}
								name="square"
								type="number"
								min={1}
								title="Жил. площадь"
								placeholder="20м²"
								classnamecontainer="applicationPart"
								prompts={prompts}
								error={errors.square?.message}
							/>
							<Controller
								name="typeCleaning"
								control={control}
								rules={{ required: "Тип уборки обязателен" }}
								render={({ field }) => (
									<Selection
										{...field}
										name="typeCleaning"
										title="Тип уборки"
										options={typesCleaning}
										classNameContainer="applicationPart"
										error={errors.typeCleaning?.message}
									/>
								)}
							/>
							<Controller
								name="phone"
								control={control}
								rules={{
									required: "Телефон обязателен",
									validate: (value) =>
										isValidNumber(value) || "Некорректный номер телефона",
								}}
								render={({ field }) => (
									<TextInput
										{...field}
										type="phone"
										name="phone"
										title="Номер телефона"
										placeholder="+7 (999) 999-99-99"
										classnamecontainer="applicationPart"
										error={errors.phone?.message}
									/>
								)}
							/>
						</div>
						<div className="price">
							{price ? <span>{price} ₽</span> : <span>Давайте посчитаем!</span>}
						</div>
						<div
							className={classNames("buttonsApplication", {
								buttonsApplicationMobile: width < 500,
							})}
						>
							<MainButton
								className="send"
								disabled={isSubmitting || !isValid}
								type="submit"
								submiting={isSubmitting}
								submitingText="Отправляем текст..."
							>
								Отправить заявку
							</MainButton>
							<MainButton
								className="more"
								onClick={() => {
									contextSection?.setActiveSection(PagePart.service);
									contextSection?.setShouldSmooth(true);
								}}
							>
								Узнать детали
							</MainButton>
						</div>
					</form>
				</div>
				{width > 900 && (
					<div className="cleanerContainer">
						<CleanerPicture className="cleaner" />
					</div>
				)}
			</main>
			<footer>
				<FooterSVG />
			</footer>
		</PageItem>
	);
});
Application.displayName = "Application";
export default Application;
