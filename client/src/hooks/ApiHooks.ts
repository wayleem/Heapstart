// hooks/ApiHooks.ts

import axios from "axios";
import { store } from "../store";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
	const token = store.getState().user.accessToken;
	console.log("Token in interceptor:", token); // Add this for debugging
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	} else {
		console.log("No token found in interceptor"); // Add this for debugging
	}
	return config;
});
