import { FC, forwardRef, SVGProps } from "react";
import { Logo } from "../../../public/svg";
import ButtonLikeText from "../../Buttons/ButtonLikeText/ButtonLikeText";
import PageItem from "../../PageItem";
import MainButton from "../../Buttons/MainButton/MainButton";
// import ButtonWithBottomLine from "../../Buttons/ButtonWithBottomLine/ButtonWithBottomLine";
import "./css.scss";
import { useNavigate } from "react-router-dom";
import { useActiveSectionContext } from "../../../hooks/ActiveSectionContext";
import { PagePart } from "../../NavigatePanel/NavigatePanel";
import { Link } from "react-router-dom";

const tools = [
	{ name: "Услуги", type: PagePart.service },
	{ name: "Уборка", type: PagePart.cleaning },
	{ name: "Клинеры", type: PagePart.cleaners },
	{ name: "О нас", type: PagePart.about },
	{ name: "Работа", type: PagePart.job },
	{ name: "FAQ", type: PagePart.faq },
	{ name: "Контакты", type: PagePart.contacts },
];

const Phone: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 18 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M16.5 12.6901V14.9401C16.5009 15.1489 16.4581 15.3557 16.3744 15.5471C16.2907 15.7385 16.168 15.9103 16.0141 16.0515C15.8601 16.1927 15.6784 16.3002 15.4806 16.3671C15.2827 16.434 15.073 16.4589 14.865 16.4401C12.5571 16.1893 10.3403 15.4007 8.3925 14.1376C6.58037 12.9861 5.04401 11.4497 3.8925 9.63757C2.62499 7.68098 1.83619 5.45332 1.59 3.13507C1.57126 2.92767 1.59591 2.71864 1.66238 2.52129C1.72885 2.32394 1.83568 2.14259 1.97608 1.98879C2.11647 1.83499 2.28736 1.7121 2.47785 1.62796C2.66834 1.54382 2.87426 1.50027 3.0825 1.50007H5.3325C5.69648 1.49649 6.04935 1.62538 6.32532 1.86272C6.6013 2.10006 6.78156 2.42966 6.8325 2.79007C6.92747 3.51012 7.10359 4.21712 7.3575 4.89757C7.45841 5.16602 7.48025 5.45776 7.42043 5.73823C7.36062 6.01871 7.22165 6.27616 7.02 6.48007L6.0675 7.43257C7.13517 9.31023 8.68984 10.8649 10.5675 11.9326L11.52 10.9801C11.7239 10.7784 11.9814 10.6395 12.2618 10.5796C12.5423 10.5198 12.8341 10.5417 13.1025 10.6426C13.783 10.8965 14.49 11.0726 15.21 11.1676C15.5743 11.219 15.9071 11.4025 16.1449 11.6832C16.3828 11.9639 16.5091 12.3223 16.5 12.6901Z"
			stroke="white"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const MailSVG: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 18 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M15 3H3C2.17157 3 1.5 3.67157 1.5 4.5V13.5C1.5 14.3284 2.17157 15 3 15H15C15.8284 15 16.5 14.3284 16.5 13.5V4.5C16.5 3.67157 15.8284 3 15 3Z"
			stroke="white"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M16.5 5.25L9.7725 9.525C9.54095 9.67007 9.27324 9.74701 9 9.74701C8.72676 9.74701 8.45905 9.67007 8.2275 9.525L1.5 5.25"
			stroke="white"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const SquareTelegram: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="34"
		height="34"
		viewBox="0 0 34 34"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<foreignObject x="-4" y="-4" width="42" height="42">
			<div
				// xmlns="http://www.w3.org/1999/xhtml"
				style={{
					backdropFilter: "blur(2px)",
					clipPath: "url(#bgblur_0_22_4873_clip_path)",
					height: "100%",
					width: "100%",
				}}
			></div>
		</foreignObject>
		<g data-figma-bg-blur-radius="4">
			<rect width="34" height="34" rx="8" fill="#529CF2" />
			<g clipPath="url(#clip1_22_4873)">
				<path
					d="M15.3014 19.1211L15.0403 22.8438C15.4139 22.8438 15.5757 22.6811 15.7697 22.4858L17.521 20.7891L21.15 23.4831C21.8155 23.8591 22.2844 23.6611 22.464 22.8624L24.846 11.5478L24.8467 11.5471C25.0578 10.5498 24.4909 10.1598 23.8424 10.4044L9.8409 15.8384C8.88533 16.2144 8.89979 16.7544 9.67846 16.9991L13.2581 18.1278L21.5729 12.8538C21.9642 12.5911 22.32 12.7364 22.0273 12.9991L15.3014 19.1211Z"
					fill="white"
				/>
			</g>
		</g>
		<defs>
			<clipPath id="bgblur_0_22_4873_clip_path" transform="translate(4 4)">
				<rect width="34" height="34" rx="8" />
			</clipPath>
			<clipPath id="clip1_22_4873">
				<rect
					width="15.7838"
					height="16"
					fill="white"
					transform="translate(9.10815 9)"
				/>
			</clipPath>
		</defs>
	</svg>
);

const SquareWhatsApp: FC<SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="34"
		height="34"
		viewBox="0 0 34 34"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<foreignObject x="-4" y="-4" width="42" height="42">
			<div
				// xmlns="http://www.w3.org/1999/xhtml"
				style={{
					backdropFilter: "blur(2px)",
					clipPath: "url(#bgblur_0_22_4877_clip_path)",
					height: "100%",
					width: "100%",
				}}
			></div>
		</foreignObject>
		<g data-figma-bg-blur-radius="4">
			<rect width="34" height="34" rx="8" fill="#1B9217" />
			<g clipPath="url(#clip1_22_4877)">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M22.6418 11.3252C21.1449 9.82653 19.1542 9.00088 17.0333 9C12.6632 9 9.10652 12.5565 9.1048 16.9279C9.10421 18.3252 9.4693 19.6892 10.1631 20.8916L9.03833 25L13.2413 23.8975C14.3994 24.5291 15.7032 24.862 17.0301 24.8625H17.0334C17.0336 24.8625 17.0332 24.8625 17.0334 24.8625C21.403 24.8625 24.96 21.3057 24.9618 16.9342C24.9626 14.8157 24.1387 12.8238 22.6418 11.3252ZM17.0334 23.5235H17.0307C15.8482 23.5231 14.6884 23.2053 13.6767 22.6049L13.436 22.4621L10.9419 23.1164L11.6076 20.6847L11.451 20.4353C10.7913 19.3861 10.4429 18.1735 10.4434 16.9283C10.4449 13.295 13.4011 10.3391 17.036 10.3391C18.7961 10.3397 20.4507 11.026 21.6949 12.2716C22.939 13.5172 23.6238 15.1729 23.6231 16.9337C23.6216 20.5673 20.6655 23.5235 17.0334 23.5235ZM20.648 18.5881C20.4499 18.4889 19.4759 18.0098 19.2943 17.9436C19.1127 17.8775 18.9806 17.8444 18.8486 18.0427C18.7165 18.241 18.3369 18.6873 18.2213 18.8195C18.1058 18.9516 17.9902 18.9682 17.7921 18.869C17.594 18.7699 16.9557 18.5607 16.199 17.8857C15.6101 17.3604 15.2125 16.7117 15.097 16.5134C14.9814 16.3151 15.0846 16.2079 15.1838 16.1091C15.2729 16.0203 15.3819 15.8777 15.481 15.762C15.58 15.6464 15.613 15.5637 15.679 15.4316C15.7451 15.2993 15.7121 15.1836 15.6625 15.0845C15.613 14.9853 15.2168 14.0102 15.0518 13.6135C14.891 13.2273 14.7276 13.2796 14.606 13.2735C14.4906 13.2677 14.3584 13.2665 14.2264 13.2665C14.0943 13.2665 13.8797 13.3161 13.6981 13.5144C13.5165 13.7127 13.0047 14.192 13.0047 15.167C13.0047 16.1422 13.7146 17.0842 13.8136 17.2164C13.9127 17.3486 15.2105 19.3496 17.1978 20.2077C17.6705 20.4118 18.0395 20.5337 18.3272 20.625C18.8017 20.7758 19.2336 20.7545 19.575 20.7035C19.9556 20.6466 20.747 20.2243 20.9121 19.7615C21.0771 19.2987 21.0771 18.9021 21.0276 18.8195C20.9782 18.7369 20.8461 18.6873 20.648 18.5881Z"
					fill="white"
				/>
			</g>
		</g>
		<defs>
			<clipPath id="bgblur_0_22_4877_clip_path" transform="translate(4 4)">
				<rect width="34" height="34" rx="8" />
			</clipPath>
			<clipPath id="clip1_22_4877">
				<rect width="16" height="16" fill="white" transform="translate(9 9)" />
			</clipPath>
		</defs>
	</svg>
);

const Footer = forwardRef<HTMLDivElement>((_, ref) => {
	const navigate = useNavigate();
	const contextSection = useActiveSectionContext();
	return (
		<PageItem className="footerPage">
			<div ref={ref} className="footerTools">
				{tools.map((tool) => (
					<ButtonLikeText
						key={tool.type}
						className="toolFooter"
						onClick={() => {
							contextSection?.setActiveSection(tool.type);
							contextSection?.setShouldSmooth(true);
							navigate("/");
						}}
					>
						{tool.name}
					</ButtonLikeText>
				))}
			</div>
			<div className="contactsFooter">
				<div className="contactsNumber">
					<span>
						<Phone />8 (921) 925-52-25
					</span>
					<span>
						<MailSVG />
						03vlad1986@gmail.com
					</span>
					<span>
						<span className="everyDay">Ежедневно</span> 08:00 - 20:00
					</span>
				</div>
				<div className="messangers">
					<Link
						to={"https://t.me/vl_vl_vlaad"}
						target="_blank"
						rel="noopener noreferrer"
					>
						<SquareTelegram />
					</Link>
					<Link
						to="https://wa.me/79219255225"
						target="_blank"
						rel="noopener noreferrer"
					>
						<SquareWhatsApp />
					</Link>
				</div>
			</div>
			<div className="footerBrend">
				<div className="brendContainer">
					<Logo fill="white" className="footerName" />
					<p>Профессиональный клининг в санкт-петербурге</p>
				</div>
				<div className="sendFooter">
					<MainButton
						onClick={() => {
							contextSection?.setActiveSection(PagePart.top);
							contextSection?.setShouldSmooth(true);
							navigate("/");
						}}
					>
						Оставить заявку
					</MainButton>
				</div>
			</div>
			<footer>
				<p>© 2025 Могу чисто. All rights reserved.</p>
				{/* <div>
					<ButtonWithBottomLine className="settingsFooter">
						Политика конфиденциальности
					</ButtonWithBottomLine>
					<ButtonWithBottomLine className="settingsFooter">
						Условия пользования
					</ButtonWithBottomLine>
				</div> */}
			</footer>
		</PageItem>
	);
});
Footer.displayName = "Footer";
export default Footer;
