import axios, { type AxiosResponse } from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
	baseURL: `${BASE_URL}/api`,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 120000,
	timeoutErrorMessage: "No Internet Connection.",
	withCredentials: false,
});

api.interceptors.response.use(
	(response: AxiosResponse) => response.data,
	(error) => {
		return Promise.reject(error);
	}
);
