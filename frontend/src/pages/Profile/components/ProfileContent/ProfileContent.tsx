import { ReactNode } from "react";
import "./css.scss";

export default function ProfileContent({ children }: { children: ReactNode }) {
	return <div className="profileContent">{children}</div>;
}
