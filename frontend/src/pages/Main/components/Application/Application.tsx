import { forwardRef, useMemo, useState } from "react";
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
import ApiController from "../../../../api/ApiController";

export type CleaningType = "express" | "comfort" | "elite";

export const typesCleaning: { type: CleaningType; label: string }[] = [
	{ type: "express", label: "Экспресс" },
	{ type: "comfort", label: "Комфорт" },
	{ type: "elite", label: "Элит" },
];
export type CleaningOption = (typeof typesCleaning)[0];

export type CreateOrderT = {
	area: number;
	type: CleaningOption;
	phoneNumber: string;
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

	const { register, watch, control, ...form } = useForm<CreateOrderT>({
		defaultValues: { type: typesCleaning[0] },
		mode: "onBlur",
	});
	const { isSubmitting, isValid, errors } = form.formState;
	const formValues = watch();
	const [success, setSuccess] = useState<string>();

	const onSubmit = async (data: CreateOrderT) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await ApiController.createOrder(data, price!);
		form.reset();
		setSuccess("Спасибо за заявку! С вами свяжется наш менеджер");
	};

	const price = useMemo(
		() =>
			formValues.area && formValues.type.type
				? calculatorPrice(Number(formValues.area), formValues.type.type)
				: undefined,
		[formValues.area, formValues.type],
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
								{...register("area", {
									required: "Площадь обязательна",
									valueAsNumber: true,
									validate: {
										positive: (value) =>
											value > 0 || "Площадь должна быть больше 0",
										maxValue: (value) =>
											value <= 1000 || "Максимальная площадь - 1000 м²",
									},
								})}
								name="area"
								type="number"
								min={1}
								title="Жил. площадь"
								placeholder="20м²"
								classnamecontainer="applicationPart"
								prompts={prompts}
								error={errors.area?.message}
							/>
							<Controller
								name="type"
								control={control}
								rules={{ required: "Тип уборки обязателен" }}
								render={({ field }) => (
									<Selection
										{...field}
										name="type"
										title="Тип уборки"
										options={typesCleaning}
										classNameContainer="applicationPart"
										error={errors.type?.message}
									/>
								)}
							/>
							<Controller
								name="phoneNumber"
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
										name="phoneNumber"
										title="Номер телефона"
										placeholder="+7 (999) 999-99-99"
										classnamecontainer="applicationPart"
										error={errors.phoneNumber?.message}
									/>
								)}
							/>
						</div>
						<div className="price">
							{price ? (
								<span>{price} ₽</span>
							) : (
								<span>{success ?? "Давайте посчитаем!"}</span>
							)}
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
								submitingText="Отправляем..."
							>
								Отправить заявку
							</MainButton>
							<MainButton
								type="button"
								className="more"
								onClick={(e) => {
									contextSection?.setActiveSection(PagePart.service);
									contextSection?.setShouldSmooth(true);
									e.stopPropagation();
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
