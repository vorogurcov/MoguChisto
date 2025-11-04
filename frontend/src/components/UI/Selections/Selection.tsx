import classNames from "classnames";
import "../common.scss";
import "./css.scss";
import Select, { Props } from "react-select";

type SelectionProps = Props & {
	title: string;
	classNameContainer?: string;
	error?: string;
};

export default function Selection({ title, error, ...props }: SelectionProps) {
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
							"option--selected": state.isSelected,
							"option--focused": state.isFocused,
						}),
					dropdownIndicator: () => "custom-dropdown-indicator",
					indicatorSeparator: () => "custom-indicator-separator",
					singleValue: () => "custom-single-value",
				}}
				isSearchable={false}
				{...props}
			/>
			{error && <div className="errorInput">{error}</div>}
		</div>
	);
}
