import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCart, updateCart, addToCart, removeFromCart } from "../thunks/cartThunks";
import { CartState, RequestStatus, RootState } from "@types";

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
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCart.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchCart.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchCart.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "An unknown error occurred";
			})
			.addCase(updateCart.fulfilled, (state, action) => {
				state.items = action.payload;
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				state.items = action.payload;
			})
			.addCase(removeFromCart.fulfilled, (state, action) => {
				state.items = action.payload;
			});
	},
});

export const { clearCart, setCartStatus, setCartError } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
