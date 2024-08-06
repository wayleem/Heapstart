import axios from "axios";
import { store } from "@store/index";
import { clearUser } from "@store/slices/userSlice";
import { clearCart } from "@store/slices/cartSlice";
import { clearAdmin } from "@store/slices/adminSlice";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const state = store.getState();
	const userToken = state.user.accessToken;
	const adminToken = state.admin.accessToken;

	if (config.url?.startsWith("/api/admin") && adminToken) {
		config.headers.Authorization = `Bearer ${adminToken}`;
	} else if (userToken) {
		config.headers.Authorization = `Bearer ${userToken}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response && error.response.status === 401) {
			if (error.config.url?.startsWith("/api/admin")) {
				store.dispatch(clearAdmin());
			} else {
				store.dispatch(clearUser());
				store.dispatch(clearCart());
			}
		}
		return Promise.reject(error);
	},
);
