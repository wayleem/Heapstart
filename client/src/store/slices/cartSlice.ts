import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { manageCart } from "../thunks/cartThunks";
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
		setCartStatus: (state, action: PayloadAction<RequestStatus>) => {
			state.status = action.payload;
		},
		setCartError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		updateCartItems: (state, action: PayloadAction<CartItems>) => {
			state.items = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(manageCart.pending, (state) => {
				state.status = "loading";
			})
			.addCase(manageCart.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
				state.error = null;
			})
			.addCase(manageCart.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "An unknown error occurred";
			});
	},
});

export const { clearCart, setCartStatus, setCartError, updateCartItems } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
