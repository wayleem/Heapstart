import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState: ProductsState = {
	items: [],
	purchasedItems: [],
	status: "idle",
	error: null,
};

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: { message: string } }>(
	"products/fetchProducts",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get("http://localhost:3001/products");
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
		const response = await axios.get(`http://localhost:3001/products/purchased-items/${user.id}`, {
			headers: { Authorization: `Bearer ${user.accessToken}` },
		});
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
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload?.message || "Failed to fetch products";
			})
			.addCase(fetchPurchasedItems.fulfilled, (state, action: PayloadAction<Product[]>) => {
				state.purchasedItems = action.payload;
			});
	},
});

export const selectAllProducts = (state: RootState) => state.products.items;
export const selectPurchasedItems = (state: RootState) => state.products.purchasedItems;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;

export default productsSlice.reducer;
