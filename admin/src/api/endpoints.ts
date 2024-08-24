import { apiClient } from "./apiClient";
import { Product, Order, LoginRequest, LoginResponse, SupportTicket, PromoCode } from "@types";

export const authApi = {
	login: (credentials: LoginRequest) => apiClient.post<LoginResponse>("/api/auth/admin/login", credentials),
	logout: () => apiClient.post<void>("/api/auth/logout"),
};

export const productApi = {
	getAllProducts: () => apiClient.get<Product[]>("/api/products"),
	getProduct: (id: string) => apiClient.get<Product>(`/api/products/${id}`),
	createProduct: (productData: FormData) =>
		apiClient.post<Product>("/api/products", productData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	updateProduct: (id: string, productData: FormData) =>
		apiClient.put<Product>(`/api/products/${id}`, productData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	deleteProduct: (id: string) => apiClient.delete<void>(`/api/products/${id}`),
};

export const orderApi = {
	getAllOrders: () => apiClient.get<Order[]>("/api/orders"),
	getOrder: (id: string) => apiClient.get<Order>(`/api/orders/${id}`),
	updateOrderStatus: (id: string, status: string) => apiClient.put<Order>(`/api/orders/${id}/status`, { status }),
	updateOrderTracking: (id: string, productId: string, trackingInfo: any) =>
		apiClient.put<Order>(`/api/orders/${id}/tracking`, { productId, trackingInfo }),
};

export const supportTicketApi = {
	getAllSupportTickets: () => apiClient.get<SupportTicket[]>("/api/support-tickets/all"),
	updateSupportTicket: (id: string, data: { status: string; adminResponse: string }) =>
		apiClient.put<SupportTicket>(`/api/support-tickets/${id}`, data),
};

export const promoCodeApi = {
	getAllPromoCodes: () => apiClient.get<PromoCode[]>("/api/promo-codes"),
	createPromoCode: (promoCodeData: Partial<PromoCode>) =>
		apiClient.post<PromoCode>("/api/promo-codes", promoCodeData),
	updatePromoCode: (id: string, promoCodeData: Partial<PromoCode>) =>
		apiClient.put<PromoCode>(`/api/promo-codes/${id}`, promoCodeData),
	deletePromoCode: (id: string) => apiClient.delete(`/api/promo-codes/${id}`),
	validatePromoCode: (code: string) =>
		apiClient.post<{ isValid: boolean; discountType: string; discountValue: number }>("/api/promo-codes/validate", {
			code,
		}),
};
