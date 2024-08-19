import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, UserState } from "@types";

const initialState: UserState = {
	id: null,
	email: null,
	accessToken: null,
	profile: null,
	status: "idle",
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<Partial<UserState>>) => {
			return { ...state, ...action.payload };
		},
		clearUser: () => initialState,
		setUserStatus: (state, action: PayloadAction<UserState["status"]>) => {
			state.status = action.payload;
		},
		setUserError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const { setUser, clearUser, setUserStatus, setUserError } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectIsAuthenticated = (state: RootState) => !!state.user.accessToken;

export default userSlice.reducer;
