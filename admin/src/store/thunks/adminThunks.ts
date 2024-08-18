import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAdmin, logoutAdmin } from "../../utils/api";

export const login = createAsyncThunk("admin/login", async (credentials: { username: string; password: string }) => {
	const response = await loginAdmin(credentials);
	return response.data;
});

export const logout = createAsyncThunk("admin/logout", async () => {
	await logoutAdmin();
});
