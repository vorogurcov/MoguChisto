import classNames from "classnames";
import "../common.scss";
import Select, { Props } from "react-select";

type SelectionProps = Props & { title: string };

export default function Selection({ title, ...props }: SelectionProps) {
	return (
		<div>
			{title}
			<Select
				unstyled
				className="selection-container"
				classNames={{
					control: (state) =>
						classNames("rectangle", {
							"rectangle--focused": state.isFocused,
						}),
					menu: () => "custom-menu",
					option: (state) =>
						classNames("custom-option", {
							"custom-option--selected": state.isSelected,
						}),
					dropdownIndicator: () => "custom-dropdown-indicator",
					indicatorSeparator: () => "custom-indicator-separator",
					singleValue: () => "custom-single-value",
					placeholder: () => "custom-placeholder",
				}}
				{...props}
			/>
		</div>
	);
}
