import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState, RequestStatus, RootState, CartItems } from "@types";

const initialState: CartState = {
	items: {},
	status: "idle",
	error: null,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		clearCart: () => initialState,
		setCartItems: (state, action: PayloadAction<CartItems>) => {
			state.items = action.payload;
		},
		setCartStatus: (state, action: PayloadAction<RequestStatus>) => {
			state.status = action.payload;
		},
		setCartError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const { clearCart, setCartItems, setCartStatus, setCartError } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
