/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, Reducer, useReducer } from "react";
import { ModalId } from "../modals/ModalRoot";
import assertNever from "../helpers/assertNever";

type ModalState = {
	modalId: ModalId | null;
	modalProps: { [key: string]: unknown };
	isOpen: boolean;
};

const initialState: ModalState = {
	modalId: null,
	modalProps: {},
	isOpen: true,
};

export const ModalStateContext = createContext(initialState);

type ModalAction =
	| { type: "HIDE_MODAL" }
	| { type: "DESTROY_MODAL" }
	| {
			type: "SHOW_MODAL";
			payload: { id: ModalId; props: ModalState["modalProps"] };
			// eslint-disable-next-line no-mixed-spaces-and-tabs
	  };

export const ModalDispatchContext = createContext<Dispatch<ModalAction>>(
	() => {},
);

const reducer: Reducer<ModalState, ModalAction> = (state, action) => {
	switch (action.type) {
		case "HIDE_MODAL":
			return { ...state, isOpen: false };
		case "DESTROY_MODAL":
			return initialState;
		case "SHOW_MODAL":
			return {
				modalId: action.payload.id,
				modalProps: action.payload.props,
				isOpen: true,
			};
		default:
			assertNever(action);
	}
};

type Props = { children: React.ReactNode };

export function ModalContextProvider({ children }: Props) {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<ModalStateContext.Provider value={state}>
			<ModalDispatchContext.Provider value={dispatch}>
				{children}
			</ModalDispatchContext.Provider>
		</ModalStateContext.Provider>
	);
}
