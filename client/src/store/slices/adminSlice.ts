import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@hooks/apiHooks";

interface LoginCredentials {
	username: string;
	password: string;
}

interface LoginResponse {
	admin: { id: string; username: string };
	token: string;
}

export const loginAdmin = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
	"admin/login",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await api.post<LoginResponse>("/api/admin/login", credentials);
			return response.data;
		} catch (error) {
			if (error instanceof Error) {
				return rejectWithValue(error.message);
			}
			return rejectWithValue("An unknown error occurred");
		}
	},
);

interface AdminState {
	admin: { id: string; username: string } | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

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
	extraReducers: (builder) => {
		builder
			.addCase(loginAdmin.pending, (state) => {
				state.status = "loading";
			})
			.addCase(loginAdmin.fulfilled, (state, action) => {
				state.admin = action.payload.admin;
				state.accessToken = action.payload.token;
				state.isAuthenticated = true;
				state.status = "succeeded";
			})
			.addCase(loginAdmin.rejected, (state, action) => {
				state.error = action.payload ?? "An unknown error occurred";
				state.status = "failed";
			});
	},
});

export const { setAdmin, clearAdmin, setAdminError } = adminSlice.actions;
export const selectAdmin = (state: RootState) => state.admin.admin;
export const selectAdminAccessToken = (state: RootState) => state.admin.accessToken;
export const selectIsAdminAuthenticated = (state: RootState) => state.admin.isAuthenticated;
export default adminSlice.reducer;
