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

	// Admin-related types
	interface Admin {
		id: string;
		username: string;
		name: string;
		role: AdminRole;
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

	// Utility types
	type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
	type AdminRole = "super" | "manager" | "support";

	var persistor: Persistor;
}

export {};
