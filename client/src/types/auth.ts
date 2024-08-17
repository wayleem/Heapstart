import { Address } from "./common";

export interface RegistrationFormData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	address: Omit<Address, "firstName" | "lastName">;
}

export interface RegistrationErrorState {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	address: Address;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterUserData {
	email: string;
	password: string;
	profile: {
		firstName: string;
		lastName: string;
		phone?: string;
		address: Address;
	};
}
