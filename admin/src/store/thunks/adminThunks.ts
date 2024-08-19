import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@api/endpoints";
import { LoginRequest } from "@types";

export const login = createAsyncThunk("admin/login", async (credentials: LoginRequest) => {
	const response = await authApi.login(credentials);
	return response;
});

export const logout = createAsyncThunk("admin/logout", async () => {
	await authApi.logout();
});
