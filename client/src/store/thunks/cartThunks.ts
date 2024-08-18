import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../api/endpoints";
import { handleApiError, log } from "../../utils/errorUtils";
import { CartItems, RootState } from "@types";

export const manageCart = createAsyncThunk<
	CartItems,
	{ action: "fetch" | "update" | "add" | "remove"; productId?: string; quantity?: number },
	{ state: RootState; rejectValue: string }
>("cart/manageCart", async ({ action, productId, quantity }, { getState, rejectWithValue }) => {
	try {
		let updatedCart: CartItems;
		const currentState = getState();

		switch (action) {
			case "fetch":
				return await userApi.getCart();
			// case "update" - if we want to update entire cart in the future (maybe clear cart on checkout)
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

		return await userApi.updateCart(updatedCart);
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", `Failed to ${action} cart`, { error: errorMessage, productId, quantity });
		return rejectWithValue(errorMessage);
	}
});
