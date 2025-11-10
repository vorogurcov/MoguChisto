import { Logo, Phone, Telegram, WhatsApp } from "../../public/svg";
import ButtonLikeText from "../Buttons/ButtonLikeText/ButtonLikeText";
import MainButton from "../Buttons/MainButton/MainButton";
import "./css.scss";
import { useActiveSectionContext } from "../../hooks/ActiveSectionContext";
import { useNavigate } from "react-router-dom";
import useWindowWidth from "../../hooks/useWindowWidth";
import { ButtonPropsType } from "../Buttons/ButtonPropsTypeAlias";
import classNames from "classnames";
import { ProfileEnum } from "../../pages/Profile/components/SideBar/SideBar";

export enum PagePart {
	top = 1,
	service,
	about,
	cleaners,
	cleaning,
	faq,
	contacts,
	job,
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
	const width = useWindowWidth();
	return width > 900 ? (
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
	) : null;
};

function ProfileButton({ ...props }: ButtonPropsType) {
	const width = useWindowWidth();
	return width > 1200 ? (
		<MainButton className="profile" {...props}>
			Профиль
		</MainButton>
	) : (
		<button {...props} className="profileMobileButton">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clipPath="url(#clip0_33_2721)">
					<path
						d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 7.57 19.18 5.86 17.12C7.55 15.8 9.68 15 12 15C14.32 15 16.45 15.8 18.14 17.12C16.43 19.18 14.03 20 12 20Z"
						fill="white"
					/>
				</g>
				<defs>
					<clipPath id="clip0_33_2721">
						<rect width="24" height="24" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</button>
	);
}

export default function NavigatePanel() {
	const navigate = useNavigate();
	const contextSection = useActiveSectionContext();
	const width = useWindowWidth();
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
			<div
				className={classNames("allButtonsNavigate", {
					allButtonsNavigateMobile: width <= 900,
				})}
			>
				<ButtonsPanel />
				<div className="tools">
					<div className="number">
						<Phone height={18} width={18} />{" "}
						{width > 1300 || (width <= 900 && width > 500) ? (
							<span>+7 (923) 123-23-35</span>
						) : null}
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
						<ProfileButton
							onClick={() => navigate("/profile/" + ProfileEnum.ME)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
