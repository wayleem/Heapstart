// client types.d.ts

declare global {
	// Base types
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

	// User-related types
	interface User {
		_id?: string;
		email: string;
		profile: Profile;
		createdAt?: Date;
		updatedAt?: Date;
		isActive?: boolean;
		lastLogin?: Date;
	}

	interface UserState {
		id: string | null;
		email: string | null;
		isAuthenticated: boolean;
		profile: Profile | null;
		status: RequestStatus;
		error: string | null;
		accessToken: string | null;
	}

	// Admin-related types
	interface Admin {
		id: string;
		username: string;
		name: string;
		role: AdminRole;
	}

	interface AdminState {
		admin: {
			id: string;
			username: string;
		} | null;
		accessToken: string | null;
		isAuthenticated: boolean;
		status: RequestStatus;
		error: string | null;
	}

	// Product-related types
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
		imageUrls: string[];
		createdAt?: Date;
		updatedAt?: Date;
		isActive: boolean;
	}

	interface ProductsState {
		items: Product[];
		purchasedItems: Product[];
		status: RequestStatus;
		error: string | null;
		selectedProduct: Product | null;
	}

	// Cart-related types
	interface CartState {
		items: { [key: string]: number };
		status: RequestStatus;
		error: string | null;
	}

	// Root state type
	interface RootState {
		cart: CartState;
		user: UserState;
		products: ProductsState;
		admin: AdminState;
	}

	// Utility types
	type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
	type AdminRole = "super" | "manager" | "support";
}

export {};
