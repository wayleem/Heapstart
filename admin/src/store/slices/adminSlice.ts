import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, logout } from "../thunks/adminThunks";
import { AdminState, LoginResponse } from "@types";

const initialState: AdminState = {
	isAuthenticated: false,
	username: null,
	token: null,
	error: null,
};

const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
				state.isAuthenticated = true;
				state.username = action.payload.admin.username;
				state.token = action.payload.token;
				state.error = null;
			})
			.addCase(login.rejected, (state, action) => {
				state.error = action.error.message || "Login failed";
			})
			.addCase(logout.fulfilled, (state) => {
				state.isAuthenticated = false;
				state.username = null;
				state.token = null;
			});
	},
});

export default adminSlice.reducer;
