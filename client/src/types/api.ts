import {
	CartItems,
	Product,
	Order,
	Profile,
	LoginCredentials,
	RegisterUserData,
	CreateSupportTicketData,
	CreateOrderData,
} from "@types";

// Auth API
export interface LoginRequest extends LoginCredentials {}
export interface LoginResponse {
	userId: string;
	email: string;
	token: string;
}

export interface RegisterRequest extends RegisterUserData {}
export interface RegisterResponse {
	userId: string;
	token: string;
}

export interface ForgotPasswordRequest {
	email: string;
}
export interface ForgotPasswordResponse {
	message: string;
}

export interface ResetPasswordRequest {
	password: string;
}
export interface ResetPasswordResponse {
	message: string;
}

// User API
export interface UpdateProfileRequest extends Partial<Profile> {}
export interface UpdateProfileResponse extends Profile {}

export interface GetCartResponse {
	cart: CartItems;
}

export interface UpdateCartRequest {
	cart: CartItems;
}
export interface UpdateCartResponse {
	cart: CartItems;
}

// Support Ticket API
export interface CreateSupportTicketRequest extends CreateSupportTicketData {}

// Product API
export interface CreateProductRequest extends FormData {}
export interface CreateProductResponse extends Product {}

export interface UpdateProductRequest extends FormData {}
export interface UpdateProductResponse extends Product {}

// Order API
export interface CreateOrderRequest extends CreateOrderData {}
export interface CreateOrderResponse extends Order {}

// Payment API
export interface CreatePaymentIntentRequest {
	items: Array<{ productId: string; quantity: number }>;
}
export interface CreatePaymentIntentResponse {
	clientSecret: string;
}
