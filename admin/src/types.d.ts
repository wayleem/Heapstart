interface ProductData {
	name: string;
	description: string;
	price: number;
	supplier_id: string;
	supplier_cost: number;
	supplier_link: string;
	category: string;
}

interface Product extends ProductData {
	_id: string;
	images: string[];
	createdAt?: Date;
	updatedAt?: Date;
	isActive: boolean;
}
