import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAdmin } from "../../api/adminApi";

export const login = createAsyncThunk(
	"admin/login",
	async ({ username, password }: { username: string; password: string }) => {
		const response = await loginAdmin(username, password);
		return response.data;
	},
);

const adminSlice = createSlice({
	name: "admin",
	initialState: {
		admin: null,
		token: null,
		isAuthenticated: false,
		status: "idle",
		error: null as string | null,
	},
	reducers: {
		logout: (state) => {
			state.admin = null;
			state.token = null;
			state.isAuthenticated = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = "loading";
			})
			.addCase(login.fulfilled, (state, action) => {
				state.admin = action.payload.admin;
				state.token = action.payload.token;
				state.isAuthenticated = true;
				state.status = "succeeded";
			})
			.addCase(login.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message || "Login Failed";
			});
	},
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;
