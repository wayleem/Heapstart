import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, userApi } from "../../api/endpoints";
import { handleApiError, log } from "../../utils/errorUtils";
import { clearCart } from "../slices/cartSlice";
import { setUser } from "@store/slices/userSlice";
import { Profile, RootState } from "@types";

interface LoginCredentials {
	email: string;
	password: string;
}

export const login = createAsyncThunk<
	{ id: string; email: string; accessToken: string },
	LoginCredentials,
	{ rejectValue: string }
>("user/login", async (credentials, { dispatch, rejectWithValue }) => {
	try {
		const response = await authApi.login(credentials);
		const { userId, email, token } = response;

		// Fetch user profile
		const profileResponse = await userApi.getProfile();
		dispatch(setUser({ profile: profileResponse }));

		return { id: userId, email, accessToken: token };
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Login failed", { error: errorMessage });
		return rejectWithValue(errorMessage);
	}
});

export const logout = createAsyncThunk<void, void, { state: RootState }>("user/logout", async (_, { dispatch }) => {
	try {
		await authApi.logout();
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Logout failed", { error: errorMessage });
	} finally {
		dispatch(clearCart());
	}
});

export const fetchUserProfile = createAsyncThunk<Profile, void, { state: RootState; rejectValue: string }>(
	"user/fetchProfile",
	async (_, { getState, rejectWithValue }) => {
		const { user } = getState();
		if (!user.isAuthenticated) {
			return rejectWithValue("User is not authenticated");
		}
		try {
			return await userApi.getProfile();
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to fetch user profile", { error: errorMessage });
			return rejectWithValue(errorMessage);
		}
	},
);

// Add other user-related thunks here (e.g., register, updateProfile)
