// src/api/endpoints.ts
import { apiClient } from "./apiClient";
import { AxiosRequestConfig } from "axios";
import { CartItems, Product, Order, Profile, LoginCredentials, RegisterUserData } from "@types";

export const authApi = {
	login: (credentials: LoginCredentials) =>
		apiClient.post<{ userId: string; email: string; token: string }>("/api/auth/login", credentials),
	register: (userData: RegisterUserData) =>
		apiClient.post<{ userId: string; token: string }>("/api/auth/register", userData),
	logout: () => apiClient.post<void>("/api/auth/logout"),
	forgotPassword: (email: string) => apiClient.post<{ message: string }>("/api/auth/forgot-password", { email }),
	resetPassword: (token: string, password: string) =>
		apiClient.post<{ message: string }>(`/api/auth/reset-password/${token}`, { password }),
};

export const userApi = {
	getProfile: () => apiClient.get<Profile>("/api/users/profile"),
	updateProfile: (profileData: Partial<Profile>) => apiClient.put<Profile>("/api/users/profile", profileData),
	getCart: () => apiClient.get<{ cart: CartItems }>("/api/users/cart"),
	updateCart: (cart: CartItems) => apiClient.put<{ cart: CartItems }>("/api/users/cart", { cart }),
};

export const productApi = {
	getAllProducts: () => apiClient.get<Product[]>("/api/products"),
	getProduct: (id: string) => apiClient.get<Product>(`/api/products/${id}`),
	createProduct: (productData: FormData) => {
		const config: AxiosRequestConfig = {
			headers: { "Content-Type": "multipart/form-data" },
		};
		return apiClient.post<Product>("/api/products", productData, config);
	},
	updateProduct: (id: string, productData: FormData) => {
		const config: AxiosRequestConfig = {
			headers: { "Content-Type": "multipart/form-data" },
		};
		return apiClient.put<Product>(`/api/products/${id}`, productData, config);
	},
	deleteProduct: (id: string) => apiClient.delete<void>(`/api/products/${id}`),
};

export const orderApi = {
	createOrder: (orderData: Omit<Order, "_id" | "userId" | "createdAt" | "updatedAt">) =>
		apiClient.post<Order>("/api/orders", orderData),
	getUserOrders: () => apiClient.get<Order[]>("/api/orders/user"),
	getOrder: (id: string) => apiClient.get<Order>(`/api/orders/${id}`),
};

export const paymentApi = {
	createPaymentIntent: (items: Array<{ productId: string; quantity: number }>) =>
		apiClient.post<{ clientSecret: string }>("/api/payment/create-payment-intent", { items }),
};
