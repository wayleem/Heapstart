export interface LoginResponse {
	token: string;
	admin: {
		id: string;
		username: string;
	};
}

export interface LoginRequest {
	username: string;
	password: string;
}
