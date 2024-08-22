import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@api/endpoints";
import { handleApiError, log } from "@utils/errorUtils";
import { setAdmin, clearAdmin, setAdminError } from "../slices/adminSlice";
import { LoginRequest, LoginResponse } from "@types";

export const login = createAsyncThunk<void, LoginRequest>("admin/login", async (credentials, { dispatch }) => {
	try {
		dispatch(setAdmin({ isAuthenticated: false, username: null, token: null, error: null }));
		const response: LoginResponse = await authApi.login(credentials);
		dispatch(
			setAdmin({
				isAuthenticated: true,
				username: response.admin.username,
				token: response.token,
				error: null,
			}),
		);
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Login failed", { error: errorMessage });
		dispatch(setAdminError(errorMessage));
		throw err;
	}
});

export const logout = createAsyncThunk<void, void>("admin/logout", async (_, { dispatch }) => {
	try {
		await authApi.logout();
		dispatch(clearAdmin());
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Logout failed", { error: errorMessage });
		// Even if the server request fails, we should still clear the local state
		dispatch(clearAdmin());
		throw err;
	}
});
