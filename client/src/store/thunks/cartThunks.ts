import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../api/endpoints";
import { handleApiError, log } from "../../utils/errorUtils";
import { CartItems, RootState } from "@types";

export const fetchCart = createAsyncThunk<CartItems, void, { rejectValue: string }>(
	"cart/fetchCart",
	async (_, { rejectWithValue }) => {
		try {
			const response = await userApi.getCart();
			return response.cart;
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to fetch cart", { error: errorMessage });
			return rejectWithValue(errorMessage);
		}
	},
);

export const updateCart = createAsyncThunk<CartItems, CartItems, { rejectValue: string }>(
	"cart/updateCart",
	async (cart, { rejectWithValue }) => {
		try {
			const response = await userApi.updateCart(cart);
			return response.cart;
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to update cart", { error: errorMessage });
			return rejectWithValue(errorMessage);
		}
	},
);

export const addToCart = createAsyncThunk<
	CartItems,
	{ productId: string; quantity: number },
	{ state: RootState; rejectValue: string }
>("cart/addToCart", async ({ productId, quantity }, { getState, rejectWithValue }) => {
	try {
		const currentState = getState();
		const updatedCart = {
			...currentState.cart.items,
			[productId]: (currentState.cart.items[productId] || 0) + quantity,
		};
		const response = await userApi.updateCart(updatedCart);
		return response.cart;
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Failed to add item to cart", { error: errorMessage, productId, quantity });
		return rejectWithValue(errorMessage);
	}
});

export const removeFromCart = createAsyncThunk<CartItems, string, { state: RootState; rejectValue: string }>(
	"cart/removeFromCart",
	async (productId, { getState, rejectWithValue }) => {
		try {
			const currentState = getState();
			const updatedCart = { ...currentState.cart.items };
			delete updatedCart[productId];
			const response = await userApi.updateCart(updatedCart);
			return response.cart;
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to remove item from cart", { error: errorMessage, productId });
			return rejectWithValue(errorMessage);
		}
	},
);
