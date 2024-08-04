// src/store/slices/userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearCart, fetchCart } from "./cartSlice";
import { api } from "../../hooks/ApiHooks";
import { AppDispatch } from "..";

// Types
type UserPayload = Partial<Omit<UserState, "isAuthenticated" | "status">>;

// Initial state
const initialState: UserState = {
  id: null,
  email: null,
  accessToken: null,
  isAuthenticated: false,
  profile: null,
  status: "idle",
  error: null,
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  userId: string;
  email: string;
  token: string;
}

export const logout = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  "user/logout",
  async (_, { dispatch }) => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear the cart, even if the logout request fails
      dispatch(clearCart());
      dispatch(clearUser());
    }
  },
);

export const login = createAsyncThunk<
  { id: string; email: string; accessToken: string },
  LoginCredentials,
  { state: RootState; dispatch: AppDispatch }
>("user/login", async (credentials, { dispatch }) => {
  try {
    const response = await api.post<LoginResponse>("/api/auth/login", credentials);
    const { userId, email, token } = response.data;

    // Fetch the user's cart after successful login
    await dispatch(fetchCart());

    return { id: userId, email, accessToken: token };
  } catch (error) {
    // Handle error
    throw error;
  }
});

// Slice
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
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Logout failed";
      });
  },
});

// Actions
export const { setUser, clearUser, setError } = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export default userSlice.reducer;
