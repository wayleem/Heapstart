// src/hooks/ApiHooks.ts

import axios from "axios";
import { store } from "../store";
import { clearUser } from "../store/slices/userSlice";
import { clearCart } from "../store/slices/cartSlice";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
	const token = store.getState().user.accessToken;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response && error.response.status === 401) {
			store.dispatch(clearUser());
			store.dispatch(clearCart());
		}
		return Promise.reject(error);
	},
);
