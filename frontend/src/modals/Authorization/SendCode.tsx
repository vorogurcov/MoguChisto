import { useState } from "react";
import TextInput from "../../components/UI/Inputs/TextInput";
import ModalHeader from "../components/ModalHeader/ModalHeader";
import ModalBase from "../ModalBase/ModalBase";
import MainButton from "../../components/Buttons/MainButton/MainButton";
import "./css.scss";
import ButtonWithBottomLine from "../../components/Buttons/ButtonWithBottomLine/ButtonWithBottomLine";
import useShowModal from "../../hooks/useShowModal";

export default function SendCode({ phone }: { phone: string }) {
	const [code, setCode] = useState("");
	const showModal = useShowModal();
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
				placeholder="_ _ _ _"
				maxLength={4}
				className="input"
				value={code}
				onChange={(e) => setCode(e.target.value)}
			/>
			<MainButton className="getCode" onClick={() => console.log("code", code)}>
				{code.length === 4 ? "Отправить" : "Получить код повторно"}
			</MainButton>
		</ModalBase>
	);
}
