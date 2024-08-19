export interface AdminState {
	isAuthenticated: boolean;
	username: string | null;
	token: string | null;
	error: string | null;
}
