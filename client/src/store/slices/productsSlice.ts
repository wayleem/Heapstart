import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { api } from "../../hooks/apiHooks";

// Utility function for error handling
const handleApiError = (err: unknown): string => {
	const error = err as AxiosError<{ message: string }>;
	return error.response?.data.message || "An unknown error occurred";
};

// Initial state
const initialState: ProductsState = {
	items: [],
	purchasedItems: [],
	status: "idle",
	error: null,
	selectedProduct: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
	"products/fetchProducts",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get<Product[]>("/api/products");
			return response.data;
		} catch (err) {
			return rejectWithValue(handleApiError(err));
		}
	},
);

export const fetchPurchasedItems = createAsyncThunk<Product[], void, { state: RootState; rejectValue: string }>(
	"products/fetchPurchasedItems",
	async (_, { getState, rejectWithValue }) => {
		const { user } = getState();
		try {
			const response = await api.get<{ purchasedItems: Product[] }>(`/api/products/purchased-items/${user.id}`);
			return response.data.purchasedItems;
		} catch (err) {
			return rejectWithValue(handleApiError(err));
		}
	},
);

// Slice
const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
			state.selectedProduct = action.payload;
		},
		clearSelectedProduct: (state) => {
			state.selectedProduct = null;
		},
		updateProduct: (state, action: PayloadAction<Product>) => {
			const index = state.items.findIndex((item) => item._id === action.payload._id);
			if (index !== -1) {
				state.items[index] = action.payload;
			}
		},
		addProduct: (state, action: PayloadAction<Product>) => {
			state.items.push(action.payload);
		},
		removeProduct: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((item) => item._id !== action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload || "Failed to fetch products";
			})
			.addCase(fetchPurchasedItems.fulfilled, (state, action) => {
				state.purchasedItems = action.payload;
			});
	},
});

// Actions
export const { setSelectedProduct, clearSelectedProduct, updateProduct, addProduct, removeProduct } =
	productsSlice.actions;

// Selectors
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectPurchasedItems = (state: RootState) => state.products.purchasedItems;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;

export default productsSlice.reducer;
