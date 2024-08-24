// src/api/endpoints.ts
import { apiClient } from "./apiClient";
import {
	Product,
	Order,
	Profile,
	ResetPasswordResponse,
	ResetPasswordRequest,
	ForgotPasswordResponse,
	ForgotPasswordRequest,
	RegisterResponse,
	RegisterRequest,
	LoginResponse,
	LoginRequest,
	CreatePaymentIntentRequest,
	CreatePaymentIntentResponse,
	SupportTicket,
	CartItems,
	CreateOrderRequest,
	CreateSupportTicketRequest,
	ValidatePromoCodeResponse,
} from "@types";

export const authApi = {
	login: (credentials: LoginRequest) => apiClient.post<LoginResponse>("/api/auth/login", credentials),
	register: (userData: RegisterRequest) => apiClient.post<RegisterResponse>("/api/auth/register", userData),
	logout: () => apiClient.post<void>("/api/auth/logout"),
	forgotPassword: (data: ForgotPasswordRequest) =>
		apiClient.post<ForgotPasswordResponse>("/api/auth/forgot-password", data),
	resetPassword: (token: string, data: ResetPasswordRequest) =>
		apiClient.post<ResetPasswordResponse>(`/api/auth/reset-password/${token}`, data),
};

export const userApi = {
	getProfile: () => apiClient.get<Profile>("/api/users/profile"),
	updateProfile: (profileData: Profile) => apiClient.put<Profile>("/api/users/profile", profileData),
	getCart: () => apiClient.get<CartItems>("/api/users/cart"),
	updateCart: (cart: CartItems) => apiClient.put<CartItems>("/api/users/cart", cart),
};

export const productApi = {
	getAllProducts: () => apiClient.get<Product[]>("/api/products"),
	getProduct: (id: string) => apiClient.get<Product>(`/api/products/${id}`),
};

export const orderApi = {
	createOrder: (orderData: CreateOrderRequest) => apiClient.post<Order>("/api/orders", orderData),
	getUserOrders: () => apiClient.get<Order[]>("/api/orders/user"),
	getOrder: (id: string) => apiClient.get<Order>(`/api/orders/${id}`),
};

export const supportTicketApi = {
	createSupportTicket: (supportTicketData: CreateSupportTicketRequest) =>
		apiClient.post("/api/support-tickets", supportTicketData),
	getUserSupportTickets: () => apiClient.get<SupportTicket[]>("/api/support-tickets/user"),
	getSupportTicket: (id: string) => apiClient.get<SupportTicket>(`/api/support-tickets/${id}`),
	deleteSupportTicket: (id: string) => apiClient.delete<void>(`/api/support-tickets/${id}`),
};

export const paymentApi = {
	createPaymentIntent: (data: CreatePaymentIntentRequest) =>
		apiClient.post<CreatePaymentIntentResponse>("/api/payment/create-payment-intent", data),
};

export const promoCodeApi = {
	validatePromoCode: (code: string) =>
		apiClient.post<ValidatePromoCodeResponse>("/api/promo-codes/validate", { code }),
};
