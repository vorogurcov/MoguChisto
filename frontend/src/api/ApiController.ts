import { getRawPhoneNumber } from "../components/UI/Inputs/TextInput";
import { apiBaseUrl } from "../core";
import apiInstance from "./apiInstance";

/**path без слеша */
const getPath = (path: string) => `${apiBaseUrl}/${path}`;

const ApiController = {
	async signup(phoneNumber: string, code?: string) {
		const adaptedPhone = getRawPhoneNumber(phoneNumber);
		const data = await apiInstance.post(getPath("user/signup"), {
			phone_number: adaptedPhone,
			...(code ? { verification_code: code } : {}),
		});
		console.log("data auth", data);
	},
};

export default ApiController;
