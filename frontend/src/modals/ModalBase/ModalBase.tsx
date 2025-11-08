import ReactModal from "react-modal";
import "./css.scss";
import { useContext } from "react";
import {
	ModalDispatchContext,
	ModalStateContext,
} from "../../hooks/ModalContext";
import classNames from "classnames";
import useWindowWidth from "../../hooks/useWindowWidth";

export default function ModalBase({
	className,
	style,
	overlayClassName,
	children,
}: Omit<ReactModal.Props, "isOpen">) {
	const state = useContext(ModalStateContext);
	const dispatch = useContext(ModalDispatchContext);
	const width = useWindowWidth();
	return (
		<ReactModal
			isOpen={state.isOpen}
			className={classNames("modalContent", className, {
				modalContentMobile: width < 500,
			})}
			style={style}
			onRequestClose={() => dispatch({ type: "DESTROY_MODAL" })}
			overlayClassName={classNames("overlay", overlayClassName)}
		>
			<div className="closeWrap">
				<button
					className="close"
					onClick={() => dispatch({ type: "DESTROY_MODAL" })}
				>
					<svg
						width="20"
						height="19"
						viewBox="0 0 20 19"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<line
							x1="1.41421"
							y1="1"
							x2="18"
							y2="17.5858"
							stroke="#D9D9D9"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						<line
							x1="1"
							y1="-1"
							x2="24.4558"
							y2="-1"
							transform="matrix(-0.707107 0.707107 0.707107 0.707107 19.0125 1)"
							stroke="#D9D9D9"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
				</button>
			</div>
			<div className="childrenModal">{children}</div>
		</ReactModal>
	);
}
