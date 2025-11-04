import { useState } from "react";
import MainButton from "../../components/Buttons/MainButton/MainButton";
import TextInput from "../../components/UI/Inputs/TextInput";
import ModalHeader from "../components/ModalHeader/ModalHeader";
import ModalBase from "../ModalBase/ModalBase";
import "./css.scss";
import useShowModal from "../../hooks/useShowModal";

export default function Authorization({ phone }: { phone?: string }) {
	const [number, setNumber] = useState(phone ?? "");
	const showModal = useShowModal();
	return (
		<ModalBase>
			<ModalHeader title="Вход в аккаунт">
				Введите ваш номер телефона для авторизации
			</ModalHeader>
			<TextInput
				type="phone"
				placeholder="(000) 000-00-00"
				className="input"
				value={number}
				onChange={(e) => setNumber(e.target.value)}
			/>
			<MainButton
				className="getCode"
				onClick={() => showModal("SendCode", { phone: number })}
			>
				Получить код
			</MainButton>
		</ModalBase>
	);
}
