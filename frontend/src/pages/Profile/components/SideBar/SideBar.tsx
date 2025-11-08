import { useNavigate } from "react-router-dom";
import ButtonLikeText from "../../../../components/Buttons/ButtonLikeText/ButtonLikeText";
import classNames from "classnames";
import "./css.scss";

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
			<ButtonLikeText className="exiteButton">Выйти</ButtonLikeText>
		</div>
	);
}
