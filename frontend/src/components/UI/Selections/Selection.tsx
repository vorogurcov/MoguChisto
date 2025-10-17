import classNames from "classnames";
import "../common.scss";
import "./css.scss";
import Select, { Props } from "react-select";

type SelectionProps = Props & { title: string; classNameContainer?: string };

export default function Selection({ title, ...props }: SelectionProps) {
	return (
		<div className={classNames(props.classNameContainer, "containerRectangle")}>
			<span className="title">{title}</span>
			<Select
				unstyled
				classNames={{
					control: () => "rectangle",
					menu: () => "custom-menu",
					menuList: () => "menu-list",
					input: () => "selectInput",
					container: () => "containerSelect",
					option: (state) =>
						classNames("option", {
							"option-selected": state.isSelected,
						}),
					dropdownIndicator: () => "custom-dropdown-indicator",
					indicatorSeparator: () => "custom-indicator-separator",
					singleValue: () => "custom-single-value",
					placeholder: () => "custom-placeholder",
					// option: () => "option",
				}}
				{...props}
			/>
		</div>
	);
}
