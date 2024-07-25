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

	interface Product {
		_id: string;
		name: string;
		description?: string;
		price: number;
		supplier_id: string;
		supplier_cost: number;
		supplier_link: string;
		category?: string;
		imageUrl?: string;
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
	}
}

export {};
