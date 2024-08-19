import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../api/endpoints";
import { handleApiError, log } from "../../utils/errorUtils";
import { CartItems, RootState } from "@types";
import { setCartItems, setCartStatus, setCartError } from "../slices/cartSlice";

export const manageCart = createAsyncThunk<
	void,
	{ action: "fetch" | "update" | "add" | "remove"; productId?: string; quantity?: number },
	{ state: RootState }
>("cart/manageCart", async ({ action, productId, quantity }, { dispatch, getState, rejectWithValue }) => {
	try {
		dispatch(setCartStatus("loading"));
		let updatedCart: CartItems;
		const currentState = getState();

		switch (action) {
			case "fetch":
				updatedCart = await userApi.getCart();
				break;
			case "update":
				updatedCart = currentState.cart.items;
				break;
			case "add":
				if (!productId || quantity === undefined)
					throw new Error("Product ID and quantity are required for adding to cart");
				updatedCart = {
					...currentState.cart.items,
					[productId]: (currentState.cart.items[productId] || 0) + quantity,
				};
				break;
			case "remove":
				if (!productId) throw new Error("Product ID is required for removing from cart");
				updatedCart = { ...currentState.cart.items };
				delete updatedCart[productId];
				break;
			default:
				throw new Error("Invalid cart action");
		}

		const result = await userApi.updateCart(updatedCart);
		dispatch(setCartItems(result));
		dispatch(setCartStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", `Failed to ${action} cart`, { error: errorMessage, productId, quantity });
		dispatch(setCartError(errorMessage));
		dispatch(setCartStatus("failed"));
		return rejectWithValue(errorMessage);
	}
});
