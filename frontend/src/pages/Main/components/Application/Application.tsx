import { forwardRef, useMemo, useRef, useState } from "react";
import CleanerPicture from "./CleanerPicture";
import TextInput, {
	isValidNumber,
} from "../../../../components/UI/Inputs/TextInput";
import Selection from "../../../../components/UI/Selections/Selection";
import MainButton from "../../../../components/Buttons/MainButton/MainButton";
import "./css.scss";
import { FooterSVG, NameBrend } from "../../../../public/svg";
import PageItem from "../../../../components/PageItem";
import { useForm, useWatch } from "react-hook-form";
import calculatorPrice from "../../../../helpers/calculatorPrice";

export type CleaningType = "exrpess" | "comfort" | "elite";

const typesCleaning: { type: CleaningType; label: string }[] = [
	{ type: "exrpess", label: "Экспресс" },
	{ type: "comfort", label: "Комфорт" },
	{ type: "elite", label: "Элит" },
];
type CleaningOption = (typeof typesCleaning)[0];

type FormT = {
	square: number;
	typeCleaning: CleaningType;
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
	// const [value, setValue] = useState<CleaningOption>(typesCleaning[0]);
	const squareRef = useRef<HTMLInputElement>(null);

	const { register, watch, ...form } = useForm<FormT>({
		defaultValues: { typeCleaning: "exrpess" },
		mode: "onBlur",
		resolver: async (values) => {
			return {
				values: isValidNumber(values.phone) ? values : {},
				errors: !isValidNumber(values.phone)
					? {
							phone: {
								type: "invalid",
								message: "Некорректный номер телефона",
							},
						}
					: {},
			};
		},
	});
	const { isSubmitting, isValid, errors } = form.formState;
	const formValues = watch();
	console.log("formValues", formValues);

	const onSubmit = (data: FormT) => {
		console.log("data", data);
	};

	const price = useMemo(
		() =>
			squareRef.current?.value
				? calculatorPrice(Number(formValues.square), formValues.typeCleaning)
				: undefined,
		[formValues.square, formValues.typeCleaning],
	);
	return (
		<PageItem className="applicationContainer">
			<main ref={ref} className="application">
				<div className="leftBlockApplication">
					<form onSubmit={(event) => form.handleSubmit(onSubmit)(event)}>
						<div className="nameBrend">
							<NameBrend />
						</div>
						<div className="applicationParts">
							<TextInput
								{...register("square", { required: true })}
								name="square"
								type="number"
								min={1}
								title="Жил. площадь"
								placeholder="20м²"
								classnamecontainer="applicationPart"
								prompts={prompts}
								error={errors.square?.message}
							/>
							{/* <Selection
								{...register("typeCleaning", { required: true })}
								name="typeCleaning"
								title="Тип уборки"
								options={typesCleaning}
								classNameContainer="applicationPart"
								// value={value}
								// onChange={(newValue) => setValue(newValue as CleaningOption)}
								error={errors.typeCleaning?.message}
							/> */}
							<TextInput
								{...register("phone", { required: true })}
								type="phone"
								name="phone"
								title="Номер телефона"
								placeholder="+7 (999) 999-99-99"
								classnamecontainer="applicationPart"
								error={errors.phone?.message}
							/>
						</div>
						<div className="price">{price && <span>{price} ₽</span>}</div>
						<div className="buttonsApplication">
							<MainButton
								className="send"
								disabled={isSubmitting || !isValid}
								type="submit"
								submiting={isSubmitting}
								submitingText="Отправляем текст..."
							>
								Отправить заявку
							</MainButton>
							<MainButton className="more">Узнать детали</MainButton>
						</div>
					</form>
				</div>
				<div className="cleanerContainer">
					<CleanerPicture className="cleaner" />
				</div>
			</main>
			<footer>
				<FooterSVG />
			</footer>
		</PageItem>
	);
});
Application.displayName = "Application";
export default Application;
