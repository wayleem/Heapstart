export interface Address {
	firstName: string;
	lastName: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
export type AdminRole = "super" | "manager" | "support";
