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

export const addToCart = createAsyncThunk<
	CartItems,
	{ productId: string; quantity: number },
	{
		state: RootState;
		rejectValue: string;
	}
>("cart/addToCart", async ({ productId, quantity }, { getState, dispatch, rejectWithValue }) => {
	try {
		const currentState = getState();
		const updatedCart = {
			...currentState.cart.items,
			[productId]: (currentState.cart.items[productId] || 0) + quantity,
		};
		const response = await api.put<{ cart: CartItems }>("/api/users/cart", { cart: updatedCart });
		return response.data.cart;
	} catch (err) {
		const error = err as AxiosError<{ message: string }>;
		if (!error.response) {
			throw err;
		}
		return rejectWithValue(error.response.data.message);
	}
});

export const removeFromCart = createAsyncThunk<
	CartItems,
	string,
	{
		state: RootState;
		rejectValue: string;
	}
>("cart/removeFromCart", async (productId, { getState, rejectWithValue }) => {
	try {
		const currentState = getState();
		const updatedCart = { ...currentState.cart.items };
		delete updatedCart[productId];
		const response = await api.put<{ cart: CartItems }>("/api/users/cart", { cart: updatedCart });
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
		clearCart: (state) => {
			state.items = {};
			state.status = "idle";
			state.error = null;
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
			})
			.addCase(addToCart.pending, (state) => {
				state.status = "loading";
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(addToCart.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "An unknown error occurred";
			})
			.addCase(removeFromCart.pending, (state) => {
				state.status = "loading";
			})
			.addCase(removeFromCart.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(removeFromCart.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "An unknown error occurred";
			});
	},
});

export const { clearCart, setCartStatus, setCartError } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
