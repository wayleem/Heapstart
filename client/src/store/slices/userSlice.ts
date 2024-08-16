import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, logout, fetchUserProfile } from "../thunks/userThunks";
import { RootState, UserPayload, UserState } from "@types";

const initialState: UserState = {
	id: null,
	email: null,
	accessToken: null,
	isAuthenticated: false,
	profile: null,
	status: "idle",
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<UserPayload>) => {
			return {
				...state,
				...action.payload,
				isAuthenticated: true,
				status: "succeeded",
			};
		},
		clearUser: () => initialState,
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.status = "failed";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = "loading";
			})
			.addCase(login.fulfilled, (state, action) => {
				state.id = action.payload.id;
				state.email = action.payload.email;
				state.accessToken = action.payload.accessToken;
				state.isAuthenticated = true;
				state.status = "succeeded";
			})
			.addCase(login.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Login failed";
			})
			.addCase(logout.fulfilled, () => initialState)
			.addCase(fetchUserProfile.fulfilled, (state, action) => {
				state.profile = action.payload;
			});
	},
});

export const { setUser, clearUser, setError } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export default userSlice.reducer;
