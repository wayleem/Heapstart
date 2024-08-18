import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductState, RootState } from "@types";
import { fetchProducts } from "@store/thunks/productThunks";

// Initial state
const initialState: ProductState = {
	items: [],
	status: "idle",
	error: null,
	selectedProduct: null,
};

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
			});
	},
});

// Actions
export const { setSelectedProduct, clearSelectedProduct, updateProduct, addProduct, removeProduct } =
	productsSlice.actions;

// Selectors
export const selectAllProducts = (state: RootState) => state.product.items;
export const selectProductsStatus = (state: RootState) => state.product.status;
export const selectProductsError = (state: RootState) => state.product.error;
export const selectSelectedProduct = (state: RootState) => state.product.selectedProduct;

export default productsSlice.reducer;
