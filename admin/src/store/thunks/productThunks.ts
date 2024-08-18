import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	getAllProducts,
	getProductById,
	createNewProduct,
	updateExistingProduct,
	deleteProduct,
} from "../../utils/api";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
	const response = await getAllProducts();
	return response.data;
});

export const fetchProduct = createAsyncThunk("products/fetchProduct", async (id: string) => {
	const response = await getProductById(id);
	return response.data;
});

export const createProduct = createAsyncThunk("products/createProduct", async (productData: FormData) => {
	const response = await createNewProduct(productData);
	return response.data;
});

export const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async ({ id, productData }: { id: string; productData: FormData }) => {
		const response = await updateExistingProduct(id, productData);
		return response.data;
	},
);

export const removeProduct = createAsyncThunk("products/removeProduct", async (id: string) => {
	await deleteProduct(id);
	return id;
});
