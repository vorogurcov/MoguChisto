import { useCallback, useContext } from "react";
import { ModalId, ModalProps } from "../modals/ModalRoot";
import { ModalDispatchContext } from "./ModalContext";

export default function useShowModal(): <ID extends ModalId>(
	id: ID,
	props: ModalProps<ID>,
) => void {
	const dispatch = useContext(ModalDispatchContext);

	return useCallback(
		(id, props) => dispatch({ type: "SHOW_MODAL", payload: { id, props } }),
		[dispatch],
	);
}
