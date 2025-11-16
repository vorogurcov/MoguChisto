import { useState } from "react";
import TextInput from "../../components/UI/Inputs/TextInput";
import ModalHeader from "../components/ModalHeader/ModalHeader";
import ModalBase from "../ModalBase/ModalBase";
import MainButton from "../../components/Buttons/MainButton/MainButton";
import "./css.scss";
import ButtonWithBottomLine from "../../components/Buttons/ButtonWithBottomLine/ButtonWithBottomLine";
import useShowModal from "../../hooks/useShowModal";
import { ModalRootProps } from "../ModalRoot";
import { useNavigate } from "react-router-dom";
import { ProfileEnum } from "../../pages/Profile/components/SideBar/SideBar";
import ApiController from "../../api/ApiController";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { sessIdKey } from "../../core";

export default function SendCode({
	phone,
	hideModal,
}: { phone: string } & ModalRootProps) {
	const [code, setCode] = useState("");
	const [ableSendAgain, setAbleSendAgain] = useState(true);
	const [submitError, setSubmitError] = useState("");
	const showModal = useShowModal();
	const navigate = useNavigate();

	const handleSubmit = () => {
		setCode("");
		ApiController.signup(phone, code)
			.then((data) => {
				if (!data.is_verification_required) {
					navigate(`/profile/${ProfileEnum.ME}`);
					localStorage.setItem(sessIdKey, "authorizated");
					hideModal();
				}
			})
			.catch((error) => {
				if (error.status === 400) {
					setSubmitError("Неверный код");
				}
			});
	};
	const handlRetry = () => {
		ApiController.signup(phone).then(() => {
			setAbleSendAgain(false);
			setTimeout(() => setAbleSendAgain(true), 60000);
		});
	};
	return (
		<ModalBase>
			<ModalHeader title="Введите код подтверждения">
				<div>
					<p>{`Код отправлен на номер ${phone}.`}</p>
					<p>
						<ButtonWithBottomLine
							onClick={() => showModal("Authorization", { phone: phone })}
							className="changeNumber"
						>
							Изменить номер
						</ButtonWithBottomLine>
					</p>
				</div>
			</ModalHeader>
			<TextInput
				placeholder="_ _ _ _ _ _"
				maxLength={6}
				className="input-send"
				value={code}
				onChange={(e) => setCode(e.target.value)}
			/>
			<div className="sendCodeWrapper">
				{code.length === 6 ? (
					<MainButton className="getCode" onClick={handleSubmit}>
						Отправить
					</MainButton>
				) : (
					<MainButton
						className="getCode"
						onClick={handlRetry}
						disabled={!ableSendAgain}
					>
						Получить код повторно
					</MainButton>
				)}
				<ErrorMessage>{submitError}</ErrorMessage>
			</div>
		</ModalBase>
	);
}
