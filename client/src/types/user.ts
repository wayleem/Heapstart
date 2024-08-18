import { Address, RequestStatus } from "./common";

export interface Profile {
	firstName: string;
	middleName?: string;
	lastName: string;
	phone?: string;
	address: Address;
}

export interface User {
	_id?: string;
	email: string;
	profile: Profile;
	createdAt?: Date;
	updatedAt?: Date;
	isActive?: boolean;
	lastLogin?: Date;
}

export interface UserState {
	id: string | null;
	email: string | null;
	profile: Profile | null;
	status: RequestStatus;
	error: string | null;
	accessToken: string | null;
}
