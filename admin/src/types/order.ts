import { Address } from "./common";

export interface Order {
	_id: string;
	userId: string;
	products: Array<{
		productId: string;
		name: string;
		quantity: number;
		price: number;
		images: string[];
	}>;
	orderTotal: number;
	shippingAddress: Address;
	paymentInfo: {
		paymentMethodId: string;
	};
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	trackingInfo: Array<{
		productId: string;
		carrier: string;
		trackingNumber: string;
		trackingLink?: string;
	}>;
	createdAt: string;
	updatedAt: string;
}

export interface OrderState {
	items: Order[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
	selectedOrder: Order | null;
}
