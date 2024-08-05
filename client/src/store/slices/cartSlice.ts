import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@hooks/apiHooks";
import { AxiosError } from "axios";

const initialState: CartState = {
	items: {},
	status: "idle",
	error: null,
};

// Utility function for error handling
const handleApiError = (err: unknown): string => {
	const error = err as AxiosError<{ message: string }>;
	return error.response?.data.message || "An unknown error occurred";
};

// Async thunks
const createCartThunk = <T>(type: string, apiCall: (arg: T) => Promise<{ data: { cart: CartItems } }>) =>
	createAsyncThunk<CartItems, T, { state: RootState; rejectValue: string }>(
		type,
		async (arg, { rejectWithValue }) => {
			try {
				const response = await apiCall(arg);
				return response.data.cart;
			} catch (err) {
				return rejectWithValue(handleApiError(err));
			}
		},
	);

export const fetchCart = createAsyncThunk<CartItems, void, { state: RootState; rejectValue: string }>(
	"cart/fetchCart",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get<{ cart: CartItems }>("/api/users/cart");
			return response.data.cart;
		} catch (err) {
			return rejectWithValue(handleApiError(err));
		}
	},
);

export const updateCart = createCartThunk("cart/updateCart", (cart: CartItems) =>
	api.put<{ cart: CartItems }>("/api/users/cart", { cart }),
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
		const response = await api.put<{ cart: CartItems }>("/api/users/cart", { cart: updatedCart });
		return response.data.cart;
	} catch (err) {
		return rejectWithValue(handleApiError(err));
	}
});

export const removeFromCart = createAsyncThunk<CartItems, string, { state: RootState; rejectValue: string }>(
	"cart/removeFromCart",
	async (productId, { getState, rejectWithValue }) => {
		try {
			const currentState = getState();
			const updatedCart = { ...currentState.cart.items };
			delete updatedCart[productId];
			const response = await api.put<{ cart: CartItems }>("/api/users/cart", { cart: updatedCart });
			return response.data.cart;
		} catch (err) {
			return rejectWithValue(handleApiError(err));
		}
	},
);

// Slice
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
		const addCaseForThunk = (thunk: any) => {
			builder
				.addCase(thunk.pending, (state) => {
					state.status = "loading";
				})
				.addCase(thunk.fulfilled, (state, action) => {
					state.status = "succeeded";
					state.items = action.payload;
				})
				.addCase(thunk.rejected, (state, action) => {
					state.status = "failed";
					state.error = action.payload ?? "An unknown error occurred";
				});
		};

		[fetchCart, updateCart, addToCart, removeFromCart].forEach(addCaseForThunk);
	},
});

// Actions and Selectors
export const { clearCart, setCartStatus, setCartError } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;
