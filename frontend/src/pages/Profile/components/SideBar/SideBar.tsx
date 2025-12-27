import { useNavigate } from "react-router-dom";
import ButtonLikeText from "../../../../components/UI/Buttons/ButtonLikeText/ButtonLikeText";
import classNames from "classnames";
import "./css.scss";
import ApiController from "../../../../api/ApiController";
import { sessIdKey } from "../../../../core";

export enum ProfileEnum {
	ME = "me",
	ORDERS = "orders",
}

const buttons: { name: string; type: ProfileEnum }[] = [
	{ name: "Мой профиль", type: ProfileEnum.ME },
	{ name: "Заказы", type: ProfileEnum.ORDERS },
];

export default function SideBar({ url }: { url: ProfileEnum }) {
	const naigate = useNavigate();
	const handleExite = () => {
		ApiController.logout().then(() => {
			naigate("/");
			localStorage.removeItem(sessIdKey);
		});
	};
	return (
		<div className="sideBar">
			{buttons.map((button) => (
				<ButtonLikeText
					key={button.type}
					onClick={() => naigate(`/profile/${button.type}`)}
					className={classNames("profileButton", {
						selectedProfile: url === button.type,
					})}
				>
					{button.name}
				</ButtonLikeText>
			))}
			<ButtonLikeText className="exiteButton" onClick={handleExite}>
				Выйти
			</ButtonLikeText>
		</div>
	);
}
