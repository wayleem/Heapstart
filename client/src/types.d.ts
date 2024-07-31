declare global {
	interface Address {
		street: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
	}

	interface Profile {
		firstName: string;
		middleName?: string;
		lastName: string;
		phone?: string;
		address: Address;
	}

	interface User {
		_id?: string;
		email: string;
		profile: Profile;
		createdAt?: Date;
		updatedAt?: Date;
		isActive?: boolean;
		lastLogin?: Date;
	}

	interface Admin {
		id: string;
		username: string;
		name: string;
		role: "super" | "manager" | "support";
	}

	interface AdminState {
		admin: {
			id: string;
			username: string;
		} | null;
		accessToken: string | null;
		isAuthenticated: boolean;
		status: "idle" | "loading" | "succeeded" | "failed";
		error: string | null;
	}

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
		imageUrls: string[]; // Change from imageUrl to imageUrls
		createdAt?: Date;
		updatedAt?: Date;
		isActive: boolean;
	}

	interface CartState {
		items: { [key: string]: number };
		status: "idle" | "loading" | "succeeded" | "failed";
		error: string | null;
	}

	interface ProductsState {
		items: Product[];
		purchasedItems: Product[];
		status: "idle" | "loading" | "succeeded" | "failed";
		error: string | null;
		selectedProduct: Product | null;
	}

	interface UserState {
		id: string | null;
		email: string | null;
		isAuthenticated: boolean;
		profile: Profile | null;
		status: "idle" | "loading" | "succeeded" | "failed";
		error: string | null;
		accessToken: string | null;
	}

	interface RootState {
		cart: CartState;
		user: UserState;
		products: ProductsState;
		admin: AdminState;
	}
}

export {};
