import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, userApi } from "../../api/endpoints";
import { handleApiError, log } from "../../utils/errorUtils";
import { clearCart } from "../slices/cartSlice";
import { setUser, clearUser, setUserStatus, setUserError } from "@store/slices/userSlice";
import { LoginCredentials, RegisterUserData, RootState } from "@types";

export const register = createAsyncThunk<void, RegisterUserData>("user/register", async (userData, { dispatch }) => {
	try {
		dispatch(setUserStatus("loading"));
		await authApi.register(userData);
		await dispatch(
			login({
				email: userData.email,
				password: userData.password,
			}),
		).unwrap();
		dispatch(setUserStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		dispatch(setUserError(errorMessage));
		dispatch(setUserStatus("failed"));
		throw err;
	}
});

export const login = createAsyncThunk<void, LoginCredentials>("user/login", async (credentials, { dispatch }) => {
	try {
		dispatch(setUserStatus("loading"));
		const response = await authApi.login(credentials);
		const { userId, email, token } = response;
		dispatch(setUser({ id: userId, email, accessToken: token }));
		try {
			const profileResponse = await userApi.getProfile();
			dispatch(setUser({ profile: profileResponse }));
		} catch (profileErr) {
			log("error", "Failed to fetch user profile", { error: profileErr });
		}
		dispatch(setUserStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Login failed", { error: errorMessage });
		dispatch(setUserError(errorMessage));
		dispatch(setUserStatus("failed"));
		throw err;
	}
});

export const logout = createAsyncThunk<void, void, { state: RootState }>("user/logout", async (_, { dispatch }) => {
	try {
		await authApi.logout();
		dispatch(clearUser());
		dispatch(clearCart());
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Logout failed", { error: errorMessage });
		throw err;
	}
});

export const fetchUserProfile = createAsyncThunk<void, void, { state: RootState }>(
	"user/fetchProfile",
	async (_, { getState, dispatch }) => {
		const state = getState();
		if (!state.user.accessToken) {
			dispatch(setUserError("User is not authenticated"));
			return;
		}
		try {
			dispatch(setUserStatus("loading"));
			const profile = await userApi.getProfile();
			dispatch(setUser({ profile }));
			dispatch(setUserStatus("succeeded"));
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to fetch user profile", { error: errorMessage });
			dispatch(setUserError(errorMessage));
			dispatch(setUserStatus("failed"));
			throw err;
		}
	},
);
