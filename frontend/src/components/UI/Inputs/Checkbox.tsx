import classNames from "classnames";
import { InputPropsType } from "./InputPropsTypeAlias";
import { MouseEvent, useEffect, useState } from "react";

export default function Checkbox({
	className,
	checked,
	onClick,
}: InputPropsType) {
	const [isChecked, setIsChecked] = useState(checked);

	useEffect(() => {
		setIsChecked(checked);
	}, [checked]);
	return (
		<div
			className={classNames(className, "checkbox", { checked: isChecked })}
			onClick={(e) => {
				setIsChecked((prev) => !prev);
				onClick?.(e as unknown as MouseEvent<HTMLInputElement>);
			}}
		>
			{isChecked && (
				<svg
					width="11"
					height="9"
					viewBox="0 0 11 9"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M0.495117 5.0584L3.05093 7.61409L10.17 0.494995"
						stroke="white"
						strokeWidth="1.4"
					/>
				</svg>
			)}
		</div>
	);
}
