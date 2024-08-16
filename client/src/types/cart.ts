import { RequestStatus } from "./common";

export interface CartItems {
	[productId: string]: number;
}

export interface CartState {
	items: CartItems;
	status: RequestStatus;
	error: string | null;
}
