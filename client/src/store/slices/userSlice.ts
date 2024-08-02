// src/store/slices/userSlice.ts

import { persistor } from "../../store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearCart } from "./cartSlice";
import { api } from "../../hooks/ApiHooks";
import { AxiosError } from "axios";
import { AppDispatch } from "..";

const initialState: UserState = {
	id: null,
	email: null,
	accessToken: null,
	isAuthenticated: false,
	profile: null,
	status: "idle",
	error: null,
};

export const logout = createAsyncThunk<
	void,
	void,
	{
		dispatch: AppDispatch;
		state: RootState;
		rejectValue: string;
	}
>("user/logout", async (_, { dispatch, rejectWithValue }) => {
	try {
		await api.post("/api/auth/logout");
	} catch (err) {
		console.error("Logout API call failed:", err);
		// Even if the API call fails, we still want to clear the local state
	}

	// Always clear local state, regardless of API call success
	dispatch(clearUser());
	dispatch(clearCart());

	// If you're using Redux Persist, purge the store
	if (persistor && persistor.purge) {
		await persistor.purge();
	}
});

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<Partial<UserState>>) => {
			return { ...state, ...action.payload, isAuthenticated: true, status: "succeeded" };
		},
		clearUser: () => initialState,
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.status = "failed";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(logout.pending, (state) => {
				state.status = "loading";
			})
			.addCase(logout.fulfilled, () => {
				return initialState;
			})
			.addCase(logout.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Logout failed";
			});
	},
});

export const { setUser, clearUser, setError } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export default userSlice.reducer;
