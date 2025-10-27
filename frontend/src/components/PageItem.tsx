import classNames from "classnames";
import { HTMLAttributes } from "react";

// обертка с классом page-tem, делающий каждому компоненту страницы управляемые паддинги,
// необходимые для правильного background color и svg. прописан в index.scss
export default function PageItem({
	children,
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={classNames("page-item", className)} {...props}>
			{children}
		</div>
	);
}
