import { Logo, Phone, Telegram, WhatsApp } from "../../public/svg";
import ButtonLikeText from "../Buttons/ButtonLikeText/ButtonLikeText";
import MainButton from "../Buttons/MainButton/MainButton";
import "./css.scss";
import { useActiveSectionContext } from "../../hooks/ActiveSectionContext";
import { useNavigate } from "react-router-dom";
import useShowModal from "../../hooks/useShowModal";

export enum PagePart {
	top,
	service,
	about,
	cleaners,
	cleaning,
	faq,
	contacts,
}

const ButtonsPanel = () => {
	const contextSection = useActiveSectionContext();
	const buttons = [
		{ name: "Услуги", type: PagePart.service },
		{ name: "Уборка", type: PagePart.cleaning },
		{ name: "Клинеры", type: PagePart.cleaners },
		{ name: "О нас", type: PagePart.about },
		{ name: "FAQ", type: PagePart.faq },
		{ name: "Контакты", type: PagePart.contacts },
	];
	const navigate = useNavigate();
	return (
		<div className="pages">
			{buttons.map((button) => (
				<ButtonLikeText
					key={button.name}
					className={
						button.type == contextSection?.activeSection ? "active" : undefined
					}
					onClick={() => {
						contextSection?.setActiveSection(button.type);
						contextSection?.setShouldSmooth(true);
						navigate("/");
					}}
				>
					{button.name}
				</ButtonLikeText>
			))}
		</div>
	);
};

export default function NavigatePanel() {
	const showModal = useShowModal();
	const navigate = useNavigate();
	const contextSection = useActiveSectionContext();
	return (
		<div className="panel">
			<div>
				<Logo
					width={101}
					height={24}
					className="logoNavigate"
					onClick={() => {
						contextSection?.setActiveSection(PagePart.top);
						contextSection?.setShouldSmooth(true);
						navigate("/");
					}}
				/>
			</div>
			<ButtonsPanel />
			<div className="tools">
				<div className="number">
					<Phone height={16} width={16} /> +7 (923) 123-23-35
				</div>
				<div className="chats">
					<a href="">
						<WhatsApp height={24} width={24} />
					</a>
					<a href="">
						<Telegram height={24} width={24} />
					</a>
				</div>
				<div>
					<MainButton
						className="profile"
						onClick={() => showModal("Authorization", {})}
					>
						Профиль
					</MainButton>
				</div>
			</div>
		</div>
	);
}
