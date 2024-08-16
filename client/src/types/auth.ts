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
	address: {
		firstName: string;
		lastName: string;
		street: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
	};
}
