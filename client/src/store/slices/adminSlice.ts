import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AdminState = {
	admin: null,
	accessToken: null,
	isAuthenticated: false,
	status: "idle",
	error: null,
};

const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		setAdmin: (state, action: PayloadAction<{ admin: { id: string; username: string }; token: string }>) => {
			state.admin = action.payload.admin;
			state.accessToken = action.payload.token;
			state.isAuthenticated = true;
			state.status = "succeeded";
		},
		clearAdmin: () => initialState,
		setAdminError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.status = "failed";
		},
	},
});

export const { setAdmin, clearAdmin, setAdminError } = adminSlice.actions;
export const selectAdmin = (state: RootState) => state.admin.admin;
export const selectAdminAccessToken = (state: RootState) => state.admin.accessToken;
export const selectIsAdminAuthenticated = (state: RootState) => state.admin.isAuthenticated;
export default adminSlice.reducer;
