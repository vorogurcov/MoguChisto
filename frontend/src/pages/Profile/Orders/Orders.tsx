import { ReactElement, ReactNode, useEffect, useState } from "react";
import MainButton from "../../../components/Buttons/MainButton/MainButton";
import {
	CleaningType,
	typesCleaning,
} from "../../Main/components/Application/Application";
import ProfileTemplate from "../components/ProfileTemplate/ProfileTemplate";
import SideBar, { ProfileEnum } from "../components/SideBar/SideBar";
import "./css.scss";
import BorderedItem from "../components/BorderedItem/BorderedItem";
import ProfileContent from "../components/ProfileContent/ProfileContent";
import ApiController from "../../../api/ApiController";
import { Link } from "react-router-dom";

type OrderProcessT = "in_progress" | "completed" | "pending";

const placeholders: Record<
	OrderProcessT,
	{ label: string; icon: ReactNode; angleFlag: ReactElement }
> = {
	completed: {
		label: "Завершено",
		icon: (
			<svg
				width="18"
				height="18"
				viewBox="0 0 18 18"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clipPath="url(#clip0_59_7653)">
					<path
						d="M12.2235 6.216L13.2765 7.28475L8.93175 11.565C8.6415 11.8553 8.25975 12 7.8765 12C7.49325 12 7.10775 11.8538 6.8145 11.5612L4.728 9.53925L5.77275 8.4615L7.8675 10.4918L12.2235 6.216ZM18 9C18 13.9628 13.9628 18 9 18C4.03725 18 0 13.9628 0 9C0 4.03725 4.03725 0 9 0C13.9628 0 18 4.03725 18 9ZM16.5 9C16.5 4.8645 13.1355 1.5 9 1.5C4.8645 1.5 1.5 4.8645 1.5 9C1.5 13.1355 4.8645 16.5 9 16.5C13.1355 16.5 16.5 13.1355 16.5 9Z"
						fill="#3DD049"
					/>
				</g>
				<defs>
					<clipPath id="clip0_59_7653">
						<rect width="18" height="18" fill="white" />
					</clipPath>
				</defs>
			</svg>
		),
		angleFlag: (
			<svg
				width="46"
				height="40"
				viewBox="0 0 46 40"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="angle"
			>
				<path d="M0 40L45.6733 0V40H0Z" fill="#D9D9D9" />
			</svg>
		),
	},
	in_progress: {
		label: "В процессе",
		icon: (
			<svg
				width="18"
				height="18"
				viewBox="0 0 18 18"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clipPath="url(#clip0_59_7438)">
					<path
						d="M8.9925 1.5C4.8525 1.5 1.5 4.86 1.5 9C1.5 13.14 4.8525 16.5 8.9925 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 8.9925 1.5ZM9 15C5.685 15 3 12.315 3 9C3 5.685 5.685 3 9 3C12.315 3 15 5.685 15 9C15 12.315 12.315 15 9 15Z"
						fill="#F5C861"
					/>
					<path
						d="M9.375 5.25H8.25V9.75L12.1875 12.1125L12.75 11.19L9.375 9.1875V5.25Z"
						fill="#F5C861"
					/>
				</g>
				<defs>
					<clipPath id="clip0_59_7438">
						<rect width="18" height="18" fill="white" />
					</clipPath>
				</defs>
			</svg>
		),
		angleFlag: (
			<svg
				width="46"
				height="40"
				viewBox="0 0 46 40"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="angle"
			>
				<path d="M0 40L45.6733 0V40H0Z" fill="#F5C861" />
			</svg>
		),
	},
	pending: {
		label: "На рассмотрении",
		icon: (
			<svg
				width="18"
				height="18"
				viewBox="0 0 18 18"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clipPath="url(#clip0_59_7438)">
					<path
						d="M8.9925 1.5C4.8525 1.5 1.5 4.86 1.5 9C1.5 13.14 4.8525 16.5 8.9925 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 8.9925 1.5ZM9 15C5.685 15 3 12.315 3 9C3 5.685 5.685 3 9 3C12.315 3 15 5.685 15 9C15 12.315 12.315 15 9 15Z"
						fill="#1b3c74"
					/>
					<path
						d="M9.375 5.25H8.25V9.75L12.1875 12.1125L12.75 11.19L9.375 9.1875V5.25Z"
						fill="#1b3c74"
					/>
				</g>
				<defs>
					<clipPath id="clip0_59_7438">
						<rect width="18" height="18" fill="white" />
					</clipPath>
				</defs>
			</svg>
		),
		angleFlag: (
			<svg
				width="46"
				height="40"
				viewBox="0 0 46 40"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="angle"
			>
				<path d="M0 40L45.6733 0V40H0Z" fill="#1b3c74" />
			</svg>
		),
	},
};

export type OrderCardT = {
	id: string;
	typeCleaning: CleaningType;
	cleaners: string;
	price: number;
	startDate: string;
	status: OrderProcessT;
	notification: string;
};

function OrderRow({
	title,
	description,
}: {
	title: string;
	description?: string;
}) {
	return (
		<div className="oneOrderRow">
			<span className="oneOrderRowTitle">{title}:</span>{" "}
			<span className="oneOrderRowDescr">{description}</span>
		</div>
	);
}

function OrderCard({
	id,
	typeCleaning,
	cleaners,
	price,
	startDate,
	status,
	notification,
}: OrderCardT) {
	return (
		<BorderedItem className="orderCard">
			<div className="orderIdWrapper">
				<span className="orderId">
					Заказ ID: <b>{id}</b>
				</span>
				<span className="notificationOrder">{notification}</span>
			</div>
			<div className="OrderRows">
				<OrderRow
					title="Тип уборки"
					description={
						typesCleaning.find((el) => el.type === typeCleaning)?.label
					}
				/>
				<OrderRow title="Клинер" description={cleaners} />
				<OrderRow title="В сумме" description={`${price} ₽`} />
				<div className="processOrder">
					<OrderRow title="Начало" description={startDate} />
					<span className="statusOrder">
						{placeholders[status].icon}
						{placeholders[status].label}
					</span>
				</div>
			</div>
			{placeholders[status].angleFlag}
		</BorderedItem>
	);
}

export default function Orders() {
	const [cards, setCards] = useState<OrderCardT[]>([]);
	useEffect(() => {
		ApiController.getOrders().then((data) => setCards(data));
	}, []);
	return (
		<ProfileTemplate>
			<SideBar url={ProfileEnum.ORDERS} />
			<ProfileContent>
				<div className="orderCards">
					{cards.map((card) => (
						<OrderCard key={card.id} {...card} />
					))}
				</div>
				<Link
					to="mailto:03vlad1986@gmail.com"
					target="_blank"
					rel="noopener noreferrer"
					style={{ textDecoration: "none", color: "inherit" }}
				>
					<MainButton className="writeToHelp">Написать в поддержку</MainButton>
				</Link>
			</ProfileContent>
		</ProfileTemplate>
	);
}
