// hooks/ApiHooks.ts

import axios from "axios";
import { store } from "../store";
import { selectAdminAccessToken } from "../store/slices/adminSlice";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
	const token = selectAdminAccessToken(store.getState());
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
