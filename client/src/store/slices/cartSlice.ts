// src/store/slices/cartSlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../hooks/ApiHooks";
import { AxiosError } from "axios";

const initialState: CartState = {
	items: {},
	status: "idle",
	error: null,
};

export const fetchCart = createAsyncThunk<
	CartItems,
	void,
	{
		rejectValue: string;
	}
>("cart/fetchCart", async (_, { rejectWithValue }) => {
	try {
		const response = await api.get<{ cart: CartItems }>("/api/users/cart");
		return response.data.cart;
	} catch (err) {
		const error = err as AxiosError<{ message: string }>;
		if (!error.response) {
			throw err;
		}
		return rejectWithValue(error.response.data.message);
	}
});

export const updateCart = createAsyncThunk<
	CartItems,
	CartItems,
	{
		rejectValue: string;
	}
>("cart/updateCart", async (cart, { rejectWithValue }) => {
	try {
		const response = await api.put<{ cart: CartItems }>("/api/users/cart", { cart });
		return response.data.cart;
	} catch (err) {
		const error = err as AxiosError<{ message: string }>;
		if (!error.response) {
			throw err;
		}
		return rejectWithValue(error.response.data.message);
	}
});

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
			const { productId, quantity } = action.payload;
			if (state.items[productId]) {
				state.items[productId] += quantity;
			} else {
				state.items[productId] = quantity;
			}
		},
		removeFromCart: (state, action: PayloadAction<string>) => {
			const productId = action.payload;
			delete state.items[productId];
		},
		updateCartItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
			const { productId, quantity } = action.payload;
			if (quantity > 0) {
				state.items[productId] = quantity;
			} else {
				delete state.items[productId];
			}
		},
		clearCart: (state) => {
			state.items = {};
		},
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
			.addCase(updateCart.pending, (state) => {
				state.status = "loading";
			})
			.addCase(updateCart.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(updateCart.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "An unknown error occurred";
			});
	},
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart, setCartStatus, setCartError } =
	cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
