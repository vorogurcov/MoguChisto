import React, { ReactElement, useEffect } from "react";
import "./css.scss";
import classNames from "classnames";
import { InputPropsType } from "../../../components/UI/Inputs/InputPropsTypeAlias";
import Checkbox from "../../../components/UI/Inputs/Checkbox";
import ApiController from "../../../api/ApiController";
import ProfileTemplate from "../components/ProfileTemplate/ProfileTemplate";
import SideBar, { ProfileEnum } from "../components/SideBar/SideBar";
import ProfileContent from "../components/ProfileContent/ProfileContent";
import BorderedItem from "../components/BorderedItem/BorderedItem";
import InputWihUnderLine from "../../../components/UI/Inputs/InputWihUnderLine";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import { Controller, useForm } from "react-hook-form";
import { isValidNumber } from "../../../components/UI/Inputs/TextInput";
import useDateInput from "../../../hooks/useDateInput";

export type UserT = {
	lastName?: string;
	firstName?: string;
	birthdayDate?: string;
	phoneNumber: string;
	email?: string;
};

export type PushT = {
	byEmail?: boolean;
	bySms?: boolean;
};

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
	return (
		<div className={classNames("CheckboxLabel", classNameWrapper)}>
			<Checkbox {...props} />
			{label}
		</div>
	);
};

export default function Me() {
	const userForm = useForm<UserT & PushT>({ mode: "onBlur" });
	useEffect(() => {
		ApiController.getUserData().then((data) => {
			userForm.reset(data);
		});
	}, [userForm]);
	const onSubmit = async (userData: UserT & PushT) => {
		const dataToSend: UserT & PushT = userData;
		await ApiController.patchUserData(dataToSend);
	};
	const formValues = userForm.watch();
	const { isValid } = useDateInput(formValues.birthdayDate ?? "");
	return (
		<ProfileTemplate>
			<SideBar url={ProfileEnum.ME} />
			<ProfileContent>
				<form onSubmit={userForm.handleSubmit(onSubmit)}>
					<BorderedItem>
						<Title>Личные данные</Title>
						<InputRow>
							<InputWihUnderLine
								{...userForm.register("firstName")}
								name="firstName"
								placeholder="Имя"
								classnamecontainer="profileInput"
								hasValue={!!formValues.firstName}
							/>
							<InputWihUnderLine
								{...userForm.register("lastName")}
								name="lastName"
								placeholder="Фамилия"
								classnamecontainer="profileInput"
								hasValue={!!formValues.lastName}
							/>
						</InputRow>
						<InputRow>
							<Controller
								name="birthdayDate"
								control={userForm.control}
								rules={{
									validate: (value) =>
										value?.length === 0 || isValid() || "Некорректная дата",
								}}
								render={({ field }) => (
									<InputWihUnderLine
										{...field}
										type="date"
										name="birthdayDate"
										placeholder="Дата рождения"
										classnamecontainer="profileInput"
										hasValue={!!formValues.birthdayDate}
										error={userForm.formState.errors.birthdayDate?.message}
									/>
								)}
							/>
							<Controller
								name="phoneNumber"
								control={userForm.control}
								rules={{
									validate: (value) =>
										isValidNumber(value ?? "") || "Некорректный номер телефона",
									required: "Номер не может быть пустой",
								}}
								render={({ field }) => (
									<InputWihUnderLine
										{...field}
										name="phoneNumber"
										type="phone"
										placeholder="Номер телефона"
										classnamecontainer="profileInput"
										error={userForm.formState.errors.phoneNumber?.message}
										hasValue={!!formValues.phoneNumber}
										readOnly
									/>
								)}
							/>
						</InputRow>
						<InputRow>
							<InputWihUnderLine
								{...userForm.register("email")}
								name="email"
								placeholder="Почта"
								classnamecontainer="profileInput"
								hasValue={!!formValues.email}
							/>
							<div />
						</InputRow>
					</BorderedItem>
					<BorderedItem className="BorderedItemPushs">
						<Title>Получать PUSH-уведомления</Title>
						<div className="pushs">
							<Controller
								name="bySms"
								control={userForm.control}
								render={({ field }) => (
									<CheckboxLabel
										label="СМС"
										checked={field.value}
										onClick={() => field.onChange(!field.value)}
									/>
								)}
							/>
							<Controller
								name="byEmail"
								control={userForm.control}
								render={({ field }) => (
									<CheckboxLabel
										label="E-mail"
										classNameWrapper="lastPush"
										checked={field.value}
										onClick={() => field.onChange(!field.value)}
									/>
								)}
							/>
						</div>
					</BorderedItem>
					<MainButton
						className="saveProfile"
						type="submit"
						submitingText="Сохраняем..."
						disabled={userForm.formState.isSubmitting}
						submiting={userForm.formState.isSubmitting}
					>
						Сохранить данные
					</MainButton>
				</form>
			</ProfileContent>
		</ProfileTemplate>
	);
}
