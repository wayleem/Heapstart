export interface ProductData {
	name: string;
	description: string;
	price: number;
	supplier_id: string;
	supplier_cost: number;
	supplier_link: string;
	category: string;
}

export interface Product extends ProductData {
	_id: string;
	images: string[];
	createdAt?: Date;
	updatedAt?: Date;
	isActive: boolean;
}

export interface ProductState {
	items: Product[];
	selectedProduct: Product | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}
