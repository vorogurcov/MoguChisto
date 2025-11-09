/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { apiBaseUrl, sessIdKey } from "../core";

const apiInstance = axios.create({
	baseURL: apiBaseUrl,
});

apiInstance.interceptors.request.use(
	(config) => {
		if (config.method?.toLowerCase() === "post") {
			config.withCredentials = true; // Устанавливаем withCredentials для POST-запросов
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

apiInstance.interceptors.response.use(
	(response) => {
		// Если ответ успешный, просто возвращаем его
		return response;
	},
	async (error) => {
		const originalRequest = error.config;
		if (
			localStorage.getItem(sessIdKey) &&
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			localStorage.removeItem(sessIdKey);
			window.location.href = "/";
		}
		return Promise.reject(error);
	},
);

export default apiInstance;
