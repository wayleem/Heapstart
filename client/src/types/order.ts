import { Address, RequestStatus } from "./common";

export interface TrackingNumber {
	productId: string;
	trackingNumber: string;
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
		quantity: number;
		price: number;
	}>;
	orderTotal: number;
	orderDate: string;
	shippingAddress: Address;
	paymentInfo: {
		paymentMethodId: string;
	};
	trackingNumber?: string;
	trackingNumbers: TrackingNumber[];
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	createdAt: string;
	updatedAt: string;
}

export interface OrderState {
	orders: Order[];
	currentOrder: Order | null;
	status: RequestStatus;
	error: string | null;
}
