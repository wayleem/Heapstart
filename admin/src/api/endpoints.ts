import { apiClient } from "./apiClient";
import { Product, Order, LoginRequest, LoginResponse } from "@types";

export const authApi = {
	login: (credentials: LoginRequest) => apiClient.post<LoginResponse>("/api/auth/admin/login", credentials),
	logout: () => apiClient.post<void>("/api/auth/admin/logout"),
};

export const productApi = {
	getAllProducts: () => apiClient.get<Product[]>("/api/products"),
	getProduct: (id: string) => apiClient.get<Product>(`/api/products/${id}`),
	createProduct: (productData: FormData) => apiClient.post<Product>("/api/products", productData),
	updateProduct: (id: string, productData: FormData) => apiClient.put<Product>(`/api/products/${id}`, productData),
	deleteProduct: (id: string) => apiClient.delete<void>(`/api/products/${id}`),
};

export const orderApi = {
	getAllOrders: () => apiClient.get<Order[]>("/api/orders"),
	getOrder: (id: string) => apiClient.get<Order>(`/api/orders/${id}`),
	updateOrderStatus: (id: string, status: string) => apiClient.put<Order>(`/api/orders/${id}/status`, { status }),
	updateOrderTracking: (id: string, productId: string, trackingInfo: any) =>
		apiClient.put<Order>(`/api/orders/${id}/tracking`, { productId, trackingInfo }),
};
