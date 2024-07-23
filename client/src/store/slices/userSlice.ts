import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../';


const initialState: UserState = {
  id: null,
  accessToken: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; accessToken: string }>) => {
      state.id = action.payload.id;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.id = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export default userSlice.reducer;
