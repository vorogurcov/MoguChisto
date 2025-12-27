import MainButton from "../../components/UI/Buttons/MainButton/MainButton";
import TextInput, { isValidNumber } from "../../components/UI/Inputs/TextInput";
import ModalHeader from "../components/ModalHeader/ModalHeader";
import ModalBase from "../ModalBase/ModalBase";
import "./css.scss";
import useShowModal from "../../hooks/useShowModal";
import { Controller, useForm } from "react-hook-form";
import ApiController from "../../api/ApiController";

export default function Authorization({ phone }: { phone?: string }) {
	const showModal = useShowModal();
	const { formState, handleSubmit, watch, control } = useForm<{
		phone: string;
	}>({
		mode: "onBlur",
		defaultValues: {
			phone: phone || "",
		},
	});
	const phoneValue = watch("phone");
	const errors = formState.errors;
	return (
		<ModalBase>
			<ModalHeader title="Вход в аккаунт">
				Введите ваш номер телефона для авторизации
			</ModalHeader>
			<form
				onSubmit={handleSubmit(async (phone) => {
					ApiController.signup(phone.phone).then(() =>
						showModal("SendCode", phone),
					);
				})}
			>
				<Controller
					name="phone"
					control={control}
					rules={{
						required: "Телефон обязателен",
						validate: (value) =>
							isValidNumber(value) || "Некорректный номер телефона",
					}}
					render={({ field }) => (
						<div className="input-wrapper">
							<TextInput
								{...field}
								type="phone"
								name="phone"
								id="phone"
								placeholder=""
								className="phone-input"
								style={
									phoneValue
										? undefined
										: { paddingLeft: "calc(20px + 1.5rem)" }
								}
								error={errors.phone?.message}
							/>
							{!phoneValue && ( // Показываем лейбл только когда поле пустое
								<label htmlFor="phone" className="labelPhone">
									<span>+7</span> (000) 000-00-00
								</label>
							)}
						</div>
					)}
				/>
				<MainButton
					className="getCode"
					type="submit"
					disabled={formState.isSubmitting}
					submitingText="Подождите..."
				>
					Получить код
				</MainButton>
			</form>
		</ModalBase>
	);
}
