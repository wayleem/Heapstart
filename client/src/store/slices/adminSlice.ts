import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AdminState = {
	admin: null,
	isAuthenticated: false,
	status: "idle",
	error: null,
};

const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		setAdmin: (state, action: PayloadAction<Admin>) => {
			state.admin = action.payload;
			state.isAuthenticated = true;
			state.status = "succeeded";
		},
		clearAdmin: () => {
			return { ...initialState };
		},
		setAdminError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.status = "failed";
		},
	},
});

export const { setAdmin, clearAdmin, setAdminError } = adminSlice.actions;
export const selectAdmin = (state: RootState) => state.admin.admin;
export const selectIsAdminAuthenticated = (state: RootState) => state.admin.isAuthenticated;
export default adminSlice.reducer;
