import "./css.scss";

export default function ErrorMessage({ children }: { children?: string }) {
	return <div className="errorInput">{children}</div>;
}
