import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
		setUser: (
			state,
			action: PayloadAction<{ id: string; email: string; accessToken: string; profile: Profile | null }>,
		) => {
			state.id = action.payload.id;
			state.email = action.payload.email;
			state.accessToken = action.payload.accessToken;
			state.profile = action.payload.profile;
			state.isAuthenticated = true;
			state.status = "succeeded";
		},
		clearUser: (state) => {
			state.id = null;
			state.email = null;
			state.profile = null;
			state.isAuthenticated = false;
			state.status = "idle";
		},
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
			state.status = "failed";
		},
	},
});

export const { setUser, clearUser, setError } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export default userSlice.reducer;
