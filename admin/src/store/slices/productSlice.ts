import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchProducts, fetchProduct, createProduct, updateProduct, removeProduct } from "../thunks/productThunks";
import { ProductState, Product } from "../../types";

const initialState: ProductState = {
	items: [],
	selectedProduct: null,
	status: "idle",
	error: null,
};

const productSlice = createSlice({
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
				state.error = action.error.message || null;
			})
			.addCase(fetchProduct.fulfilled, (state, action: PayloadAction<Product>) => {
				state.selectedProduct = action.payload;
			})
			.addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
				state.items.push(action.payload);
			})
			.addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
				const index = state.items.findIndex((item) => item._id === action.payload._id);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
				state.selectedProduct = action.payload;
			})
			.addCase(removeProduct.fulfilled, (state, action: PayloadAction<string>) => {
				state.items = state.items.filter((item) => item._id !== action.payload);
			});
	},
});

export default productSlice.reducer;
