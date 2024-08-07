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
		images: string[];
		createdAt?: Date;
		updatedAt?: Date;
		isActive: boolean;
	}

	interface TrackingNumber {
		productId: string;
		trackingNumber: string;
	}

	interface CreateOrderData {
		products: Array<{
			productId: string;
			quantity: number;
			price: number;
		}>;
		shippingAddress: Address;
		paymentInfo: any; // Consider creating a more specific type for paymentInfo
		orderTotal: number;
	}

	interface Order {
		_id: string;
		userId: string;
		products: ProductInOrder[];
		orderTotal: number;
		orderDate: string;
		shippingAddress: Address;
		trackingNumber?: string;
		trackingNumbers: TrackingNumber[];
		status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
		createdAt: string;
		updatedAt: string;
	}

	// Utility types
	type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
	type AdminRole = "super" | "manager" | "support";

	var persistor: Persistor;
}

export {};
