import classNames from "classnames";
import { InputPropsType } from "./InputPropsTypeAlias";
import "../common.scss";

type Props = InputPropsType & {
	title?: string;
	prompts?: string[];
	classNameContainer?: string;
};

export default function TextInput({ title, ...props }: Props) {
	return (
		<div className={classNames(props.classNameContainer, "containerRectangle")}>
			<span className="title">{title}</span>
			<input
				type={props.type ?? "text"}
				className={classNames("rectangle", props.className)}
				{...props}
			/>
		</div>
	);
}
