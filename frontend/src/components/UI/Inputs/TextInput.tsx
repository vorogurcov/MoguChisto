import classNames from "classnames";
import { InputPropsType } from "./InputPropsTypeAlias";
import "../common.scss";
import "./css.scss";
import InfoHover from "../../InfoHover/InfoHover";

type Props = InputPropsType & {
	title?: string;
	prompts?: string[];
	classnamecontainer?: string;
};

export default function TextInput({ title, prompts, ...props }: Props) {
	return (
		<div className={classNames(props.classnamecontainer, "containerRectangle")}>
			<div className="titleContainer">
				<span className="title">{title}</span>
				{prompts && <InfoHover infoStrings={prompts} />}
			</div>
			<input
				type={props.type ?? "text"}
				className={classNames("rectangle", props.className)}
				{...props}
			/>
		</div>
	);
}
