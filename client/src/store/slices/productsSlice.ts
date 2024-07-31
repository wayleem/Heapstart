import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { api } from "../../hooks/ApiHooks";

const initialState: ProductsState = {
	items: [],
	purchasedItems: [],
	status: "idle",
	error: null,
	selectedProduct: null,
};

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: { message: string } }>(
	"products/fetchProducts",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get<Product[]>("/api/products");
			return response.data;
		} catch (err) {
			const error = err as AxiosError<{ message: string }>;
			if (!error.response) {
				throw err;
			}
			return rejectWithValue(error.response.data);
		}
	},
);

export const fetchPurchasedItems = createAsyncThunk<
	Product[],
	void,
	{ state: RootState; rejectValue: { message: string } }
>("products/fetchPurchasedItems", async (_, { getState, rejectWithValue }) => {
	const { user } = getState();
	try {
		const response = await api.get<{ purchasedItems: Product[] }>(`/api/products/purchased-items/${user.id}`);
		return response.data.purchasedItems;
	} catch (err) {
		const error = err as AxiosError<{ message: string }>;
		if (!error.response) {
			throw err;
		}
		return rejectWithValue(error.response.data);
	}
});

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
				state.error = action.payload?.message || "Failed to fetch products";
			})
			.addCase(fetchPurchasedItems.fulfilled, (state, action) => {
				state.purchasedItems = action.payload;
			});
	},
});

export const { setSelectedProduct, clearSelectedProduct, updateProduct, addProduct, removeProduct } =
	productsSlice.actions;

export const selectAllProducts = (state: RootState) => state.products.items;
export const selectPurchasedItems = (state: RootState) => state.products.purchasedItems;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;

export default productsSlice.reducer;
