import { createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../../api/endpoints";
import { handleApiError, log } from "../../utils/errorUtils";
import {
	setProducts,
	setSelectedProduct,
	updateProduct,
	setProductStatus,
	setProductError,
} from "../slices/productSlice";

export const fetchProducts = createAsyncThunk<void, void>("products/fetchProducts", async (_, { dispatch }) => {
	try {
		dispatch(setProductStatus("loading"));
		const products = await productApi.getAllProducts();
		dispatch(setProducts(products));
		dispatch(setProductStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Failed to fetch products", { error: errorMessage });
		dispatch(setProductError(errorMessage));
		dispatch(setProductStatus("failed"));
		throw err;
	}
});

export const fetchProduct = createAsyncThunk<void, string>("products/fetchProduct", async (productId, { dispatch }) => {
	try {
		dispatch(setProductStatus("loading"));
		const product = await productApi.getProduct(productId);
		dispatch(updateProduct(product));
		dispatch(setSelectedProduct(product));
		dispatch(setProductStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Failed to fetch product", { error: errorMessage, productId });
		dispatch(setProductError(errorMessage));
		dispatch(setProductStatus("failed"));
		throw err;
	}
});
