import { getRawPhoneNumber } from "../components/UI/Inputs/TextInput";
import { apiBaseUrl } from "../core";
import { formatDateForInput, formatPhoneNumber } from "../helpers/formatData";
import {
	CleaningOption,
	CreateOrderT,
} from "../pages/Main/components/Application/Application";
import { PushT, UserT } from "../pages/Profile/Me/Me";
import { OrderCardT } from "../pages/Profile/Orders/Orders";
import apiInstance from "./apiInstance";

/**path без слеша */
const getPath = (path: string) => `${apiBaseUrl}/${path}`;

const adaptSnakeCase = (snakeKey: string) =>
	snakeKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const adaptCamelToSnake = (camelKey: string): string => {
	return camelKey.replace(
		/([A-Z])/g,
		(_, letter) => `_${letter.toLowerCase()}`,
	);
};

const ApiController = {
	async signup(phoneNumber: string, code?: string) {
		const adaptedPhone = getRawPhoneNumber(phoneNumber);
		const data = await apiInstance.post(getPath("user/signup"), {
			phone_number: adaptedPhone,
			...(code ? { verification_code: code } : {}),
		});
		console.log("data", data);
		return data.data as { is_verification_required: boolean; sessid?: string };
	},
	async logout() {
		await apiInstance.delete(getPath("/user/logout"));
	},
	async getUserData() {
		const data = (
			await Promise.all([
				apiInstance.get(getPath("user/profile")),
				apiInstance.get(getPath("user/notifications")),
			])
		).map((el) => el.data);
		const adaptedData = {
			...Object.fromEntries(
				Object.entries(data[0]).map(([key, value]) => [
					adaptSnakeCase(key),
					value,
				]),
			),
			...Object.fromEntries(
				Object.entries(data[1]).map(([key, value]) => [
					adaptSnakeCase(key),
					value,
				]),
			),
		};
		adaptedData.phoneNumber = formatPhoneNumber(
			adaptedData.phoneNumber as string,
		);
		return adaptedData;
	},
	async patchUserData(userData: UserT & PushT) {
		await Promise.all([
			apiInstance.patch(getPath("user/profile"), {
				last_name: userData.lastName,
				first_name: userData.firstName,
				phone_number: getRawPhoneNumber(userData.phoneNumber),
				email: userData.email,
				birthday_date: formatDateForInput(userData.birthdayDate),
			}),
			apiInstance.patch(getPath("user/notifications"), {
				by_email: !!userData.byEmail,
				by_sms: !!userData.bySms,
			}),
		]);
	},
	async createOrder(order: CreateOrderT, price: number) {
		console.log("post");
		await apiInstance.post(getPath("orders/"), {
			...Object.fromEntries(
				Object.entries(order).map(([key, value]) => [
					adaptCamelToSnake(key),
					key === "phoneNumber"
						? getRawPhoneNumber(value.toString())
						: key === "type"
							? (value as CleaningOption).type
							: value,
				]),
			),
			cost: price,
		});
	},
	async getOrders() {
		console.log("get");
		const data = await apiInstance.get(getPath("orders/"));
		console.log("data", data);
	},
};

export default ApiController;
