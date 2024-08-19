import { RequestStatus } from "./common";

export interface Product {
	_id: string;
	name: string;
	description: string;
	price: number;
	supplier_id: string;
	supplier_cost: number;
	supplier_link: string;
	category: string;
	images: string[];
	isActive: boolean;
}

export interface ProductState {
	items: Product[];
	status: RequestStatus;
	error: string | null;
	selectedProduct: Product | null;
}
