import React, { ReactElement, useState } from "react";
import InputWihUnderLine from "../../../../components/UI/Inputs/InputWihUnderLine";
import BorderedItem from "../BorderedItem/BorderedItem";
import { InputPropsType } from "../../../../components/UI/Inputs/InputPropsTypeAlias";
import Checkbox from "../../../../components/UI/Inputs/Checkbox";
import ProfileTemplate from "../ProfileTemplate/ProfileTemplate";
import SideBar, { ProfileEnum } from "../SideBar/SideBar";
import "./css.scss";
import classNames from "classnames";
import MainButton from "../../../../components/Buttons/MainButton/MainButton";
import ProfileContent from "../ProfileContent/ProfileContent";

const Title = ({ children }: { children: string }) => {
	return <div className="profileTitle">{children}</div>;
};

const InputRow = ({
	children,
}: {
	children: ReactElement[] | ReactElement;
}) => {
	return <div className="InputRow">{children}</div>;
};

const CheckboxLabel = ({
	label,
	classNameWrapper,
	...props
}: { label: string; classNameWrapper?: string } & InputPropsType) => {
	const [checked, setChecked] = useState(false);
	return (
		<div
			className={classNames("CheckboxLabel", classNameWrapper)}
			onClick={() => setChecked((prev) => !prev)}
		>
			<Checkbox {...props} checked={checked} />
			{label}
		</div>
	);
};

export default function Me() {
	return (
		<ProfileTemplate>
			<SideBar url={ProfileEnum.ME} />
			<ProfileContent>
				<BorderedItem>
					<Title>Личные данные</Title>
					<InputRow>
						<InputWihUnderLine
							placeholder="Имя"
							classnamecontainer="profileInput"
						/>
						<InputWihUnderLine
							placeholder="Фамилия"
							classnamecontainer="profileInput"
						/>
					</InputRow>
					<InputRow>
						<InputWihUnderLine
							type="date"
							placeholder="Дата рождения"
							classnamecontainer="profileInput"
						/>
						<InputWihUnderLine
							type="phone"
							placeholder="Номер телефона"
							classnamecontainer="profileInput"
						/>
					</InputRow>
					<InputRow>
						<InputWihUnderLine
							placeholder="Почта"
							classnamecontainer="profileInput"
						/>
					</InputRow>
				</BorderedItem>
				<BorderedItem className="BorderedItemPushs">
					<Title>Получать PUSH-уведомления</Title>
					<div className="pushs">
						<CheckboxLabel label="СМС" />
						<CheckboxLabel label="Рассылки" />
						<CheckboxLabel label="E-mail" classNameWrapper="lastPush" />
					</div>
				</BorderedItem>
				<MainButton className="saveProfile">Сохранить данные</MainButton>
			</ProfileContent>
		</ProfileTemplate>
	);
}
