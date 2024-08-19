import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductState, RootState } from "@types";

const initialState: ProductState = {
	items: [],
	status: "idle",
	error: null,
	selectedProduct: null,
};

const productSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		setProducts: (state, action: PayloadAction<Product[]>) => {
			state.items = action.payload;
		},
		setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
			state.selectedProduct = action.payload;
		},
		addProduct: (state, action: PayloadAction<Product>) => {
			state.items.push(action.payload);
		},
		updateProduct: (state, action: PayloadAction<Product>) => {
			const index = state.items.findIndex((item) => item._id === action.payload._id);
			if (index !== -1) {
				state.items[index] = action.payload;
			}
		},
		removeProduct: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((item) => item._id !== action.payload);
		},
		setProductStatus: (state, action: PayloadAction<ProductState["status"]>) => {
			state.status = action.payload;
		},
		setProductError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	setProducts,
	setSelectedProduct,
	addProduct,
	updateProduct,
	removeProduct,
	setProductStatus,
	setProductError,
} = productSlice.actions;

export const selectAllProducts = (state: RootState) => state.product.items;
export const selectProductsStatus = (state: RootState) => state.product.status;
export const selectProductsError = (state: RootState) => state.product.error;
export const selectSelectedProduct = (state: RootState) => state.product.selectedProduct;
export const selectProductById = (state: RootState, productId: string) =>
	state.product.items.find((product) => product._id === productId);

export default productSlice.reducer;
