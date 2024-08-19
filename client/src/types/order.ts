import { Address, RequestStatus } from "./common";

export interface TrackingInfo {
	productId: string;
	carrier?: string;
	trackingNumber?: string;
	trackingLink?: string;
}

export interface CreateOrderData {
	products: Array<{
		productId: string;
		quantity: number;
		price: number;
	}>;
	shippingAddress: Address;
	paymentInfo: {
		paymentMethodId: string;
	};
	orderTotal: number;
}

export interface Order {
	_id: string;
	userId: string;
	products: Array<{
		productId: string;
		name: string;
		images: string[];
		quantity: number;
		price: number;
	}>;
	orderTotal: number;
	shippingAddress: Address;
	paymentInfo: {
		paymentMethodId: string;
	};
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	trackingInfo: TrackingInfo[];
	createdAt: string;
	updatedAt: string;
}

export interface OrderState {
	orders: Order[];
	currentOrder: Order | null;
	status: RequestStatus;
	error: string | null;
}
