// src/api/apiClient.ts

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from "axios";
import { store } from "@store/index";
import { clearUser, selectUser } from "@store/slices/userSlice";
import { clearCart } from "@store/slices/cartSlice";

class ApiClient {
	private static instance: ApiClient;
	private api: AxiosInstance;

	private constructor() {
		this.api = axios.create({
			baseURL: import.meta.env.VITE_API_BASE_URL,
			withCredentials: true,
		});

		this.initializeInterceptors();
	}

	public static getInstance(): ApiClient {
		if (!ApiClient.instance) {
			ApiClient.instance = new ApiClient();
		}
		return ApiClient.instance;
	}

	private initializeInterceptors() {
		this.api.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				const user = selectUser(store.getState());
				if (user.accessToken) {
					config.headers = config.headers || {};
					config.headers.Authorization = `Bearer ${user.accessToken}`;
				}
				return config;
			},
			(error: AxiosError) => Promise.reject(error),
		);

		this.api.interceptors.response.use(
			(response: AxiosResponse) => response,
			(error: AxiosError) => {
				if (error.response?.status === 401) {
					store.dispatch(clearUser());
					store.dispatch(clearCart());
				}
				return Promise.reject(error);
			},
		);
	}

	public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.api.get<T>(url, config);
		return response.data;
	}

	public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.api.post<T>(url, data, config);
		return response.data;
	}

	public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.api.put<T>(url, data, config);
		return response.data;
	}

	public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.api.delete<T>(url, config);
		return response.data;
	}
}

export const apiClient = ApiClient.getInstance();
