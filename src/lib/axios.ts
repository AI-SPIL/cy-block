import type { ErrorApiResponse } from "@/types/api";
import axios, { AxiosError, type AxiosResponse } from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
	baseURL: `${BASE_URL}/api`,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 120000,
	timeoutErrorMessage: "No Internet Connection.",
	withCredentials: true,
});

api.interceptors.response.use(
	(response: AxiosResponse) => response.data,
	(error: AxiosError<ErrorApiResponse>) => {
		if (error.response?.status === 401) {
			// Redirect to login page on unauthorized
			window.location.href = "/";
		}
		return Promise.reject(error);
	}
);
