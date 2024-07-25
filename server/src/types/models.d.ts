import { Types } from "mongoose";

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

	interface Tokens {
		resetPasswordToken?: string;
		resetPasswordExpires?: Date;
		verificationToken?: string;
	}

	interface ProductInOrder {
		productId: Types.ObjectId;
		quantity: number;
		price: number;
	}

	interface TrackingNumber {
		productId: Types.ObjectId;
		trackingNumber: string;
	}
}

export {};
