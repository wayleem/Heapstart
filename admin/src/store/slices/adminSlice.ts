import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminState, RootState } from "@types";

const initialState: AdminState = {
	isAuthenticated: false,
	username: null,
	token: null,
	error: null,
};

const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		setAdmin: (state, action: PayloadAction<Partial<AdminState>>) => {
			return { ...state, ...action.payload };
		},
		clearAdmin: () => initialState,
		setAdminError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const { setAdmin, clearAdmin, setAdminError } = adminSlice.actions;

export const selectAdmin = (state: RootState) => state.admin;
export const selectIsAuthenticated = (state: RootState) => state.admin.isAuthenticated;
export const selectAdminError = (state: RootState) => state.admin.error;

export default adminSlice.reducer;
