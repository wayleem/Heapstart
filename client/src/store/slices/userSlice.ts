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
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload, isAuthenticated: true, status: 'succeeded' };
    },
    clearUser: () => initialState,
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

export const { setUser, clearUser, setError } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export default userSlice.reducer;
