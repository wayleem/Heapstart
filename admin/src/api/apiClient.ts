import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { store } from "@store/index";

class ApiClient {
	private static instance: ApiClient;
	private api: AxiosInstance;

	private constructor() {
		this.api = axios.create({
			baseURL: import.meta.env.VITE_API_BASE_URL,
			headers: {
				"Content-Type": "application/json",
				"Admin-Token": import.meta.env.VITE_ADMIN_TOKEN,
			},
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
			(config) => {
				const jwtToken = store.getState().admin.token;
				const adminToken = import.meta.env.VITE_ADMIN_TOKEN;

				if (jwtToken) {
					config.headers = config.headers || {};
					config.headers["Authorization"] = `Bearer ${jwtToken}`;
				}
				if (adminToken) {
					config.headers = config.headers || {};
					config.headers["Admin-Token"] = adminToken;
				}
				return config;
			},
			(error) => Promise.reject(error),
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
