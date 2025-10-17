import classNames from "classnames";
import { InputPropsType } from "./InputPropsTypeAlias";
import "../common.scss";

type Props = InputPropsType & { title?: string; prompts?: string[] };

export default function TextInput({ title, ...props }: Props) {
	return (
		<div>
			{title}
			<input
				type={props.type ?? "text"}
				className={classNames("rectangle", props.className)}
				{...props}
			/>
		</div>
	);
}
