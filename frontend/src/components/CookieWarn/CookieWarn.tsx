import { useCookies } from "react-cookie";
import MainButton from "../UI/Buttons/MainButton/MainButton";
import "./css.scss";
import ButtonWithBottomLine from "../UI/Buttons/ButtonWithBottomLine/ButtonWithBottomLine";

export default function CookieWarn() {
	const [cookies, setCookie] = useCookies(["acceptedCookie"]);
	return !cookies.acceptedCookie ? (
		<div className="cookieWarn">
			Мы используем куки для работы сайта.{" "}
			<a
				href="/docs/cookie.docx"
				download="cookie.docx"
				style={{ textDecoration: "none", color: "inherit" }}
			>
				<ButtonWithBottomLine className="settingsFooter">
					Подробнее
				</ButtonWithBottomLine>
			</a>
			<div className="acceptCookieButWrap">
				<MainButton onClick={() => setCookie("acceptedCookie", true)}>
					Принять
				</MainButton>
			</div>
		</div>
	) : null;
}
