import { lazy, Suspense, useContext, useCallback, useMemo } from "react";
import { ModalDispatchContext, ModalStateContext } from "../hooks/ModalContext";

const MODAL_COMPONENTS = {
	Authorization: () => import("./Authorization/Authorization"),
	SendCode: () => import("./Authorization/SendCode"),
};

export type ModalId = keyof typeof MODAL_COMPONENTS;

export type ModalRootProps = {
	hideModal: () => void;
};

/** Извлекает значение из промиса */
export type Unpromisify<T> = T extends Promise<infer R> ? R : T;

export type ModalProps<ID extends ModalId> = Omit<
	React.ComponentPropsWithoutRef<
		Unpromisify<ReturnType<(typeof MODAL_COMPONENTS)[ID]>>["default"]
	>,
	keyof ModalRootProps
>;

export const isModalId = (id: string): id is ModalId => id in MODAL_COMPONENTS;

export default function ModalRoot() {
	const state = useContext(ModalStateContext);
	const dispatch = useContext(ModalDispatchContext);

	const hideModal = useCallback(
		() => dispatch({ type: "HIDE_MODAL" }),
		[dispatch],
	);

	// Обернём в memo, т.к. lazy всегда возвращает новый компонент
	const Modal = useMemo(
		() =>
			state.modalId &&
			MODAL_COMPONENTS[state.modalId] &&
			lazy(
				MODAL_COMPONENTS[state.modalId] as () => Promise<{
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					default: React.ComponentType<any>;
				}>,
			),
		[state.modalId],
	);

	const props: ModalRootProps = { hideModal };

	return Modal ? (
		<Suspense fallback={null}>
			<Modal {...state.modalProps} {...props} />
		</Suspense>
	) : null;
}
