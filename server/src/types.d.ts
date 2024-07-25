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

	interface IUser {
		email: string;
		passwordHash: string;
		isAdmin: boolean;
		createdAt: Date;
		updatedAt: Date;
		isActive: boolean;
		profile: Profile;
		orderHistory: Types.ObjectId[];
		lastLogin?: Date;
		tokens: Tokens;
	}

	interface IUserMethods {
		comparePassword(candidatePassword: string): Promise<boolean>;
	}

	type UserModel = Model<IUser, {}, IUserMethods>;

	interface ProductInOrder {
		productId: Types.ObjectId;
		quantity: number;
		price: number;
	}

	interface TrackingNumber {
		productId: Types.ObjectId;
		trackingNumber: string;
	}

	interface IOrder {
		_id: Types.ObjectId;
		userId: Types.ObjectId;
		products: ProductInOrder[];
		orderTotal: number;
		orderDate: Date;
		shippingAddress: Address;
		trackingNumber?: string;
		trackingNumbers: TrackingNumber[];
		status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
		createdAt: Date;
		updatedAt: Date;
	}

	interface IProduct {
		_id: Types.ObjectId;
		name: string;
		description?: string;
		price: number;
		supplier_id: string;
		supplier_cost: number;
		supplier_link: string;
		category?: string;
		imageUrl?: string;
		createdAt: Date;
		updatedAt: Date;
		isActive: boolean;
	}

	namespace NodeJS {
		interface ProcessEnv {
			MONGODB_URL: string;
			MONGODB_NAME: string;
			JWT_SECRET: string;
			EMAIL_USER: string;
			EMAIL_PASS: string;
			EMAIL_HOST: string;
			EMAIL_PORT: string;
		}
	}
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}

export {};
