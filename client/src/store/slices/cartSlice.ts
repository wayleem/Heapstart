import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CartState = {
	items: {},
	status: "idle",
	error: null,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
			const { itemId, quantity } = action.payload;
			state.items[itemId] = (state.items[itemId] || 0) + quantity;
		},
		removeFromCart: (state, action: PayloadAction<string>) => {
			const itemId = action.payload;
			if (state.items[itemId]) {
				state.items[itemId] -= 1;
				if (state.items[itemId] === 0) {
					delete state.items[itemId];
				}
			}
		},
		updateCartItemCount: (state, action: PayloadAction<{ itemId: string; amount: number }>) => {
			const { itemId, amount } = action.payload;
			if (amount === 0) {
				delete state.items[itemId];
			} else {
				state.items[itemId] = amount;
			}
		},
		clearCart: (state) => {
			state.items = {};
		},
	},
});

export const { addToCart, removeFromCart, updateCartItemCount, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
