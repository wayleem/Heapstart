// src/api/endpoints.ts

import { apiClient } from "./apiClient";
import { AxiosRequestConfig } from "axios";

export const authApi = {
	login: (credentials: { email: string; password: string }) => apiClient.post("/api/auth/login", credentials),
	register: (userData: any) => {
		console.log("Sending registration data to server:", userData);
		return apiClient.post("/api/auth/register", userData);
	},
	logout: () => apiClient.post("/api/auth/logout"),
	forgotPassword: (email: string) => apiClient.post("/api/auth/forgot-password", { email }),
	resetPassword: (token: string, password: string) =>
		apiClient.post(`/api/auth/reset-password/${token}`, { password }),
};

export const userApi = {
	getProfile: () => apiClient.get("/api/users/profile"),
	updateProfile: (profileData: any) => apiClient.put("/api/users/profile", profileData),
	getCart: () => apiClient.get("/api/users/cart"),
	updateCart: (cart: any) => apiClient.put("/api/users/cart", { cart }),
};

export const productApi = {
	getAllProducts: () => apiClient.get("/api/products"),
	getProduct: (id: string) => apiClient.get(`/api/products/${id}`),
	createProduct: (productData: FormData) => {
		const config: AxiosRequestConfig = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};
		return apiClient.post("/api/products", productData, config);
	},
	updateProduct: (id: string, productData: FormData) => {
		const config: AxiosRequestConfig = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};
		return apiClient.put(`/api/products/${id}`, productData, config);
	},
	deleteProduct: (id: string) => apiClient.delete(`/api/products/${id}`),
};

export const orderApi = {
	createOrder: (orderData: any) => apiClient.post("/api/orders", orderData),
	getUserOrders: () => apiClient.get("/api/orders/user"),
	getOrder: (id: string) => apiClient.get(`/api/orders/${id}`),
};

export const paymentApi = {
	createPaymentIntent: (items: any[]) => apiClient.post("/api/payment/create-payment-intent", { items }),
};
