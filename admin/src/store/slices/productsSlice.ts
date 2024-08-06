import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/adminApi";

export const fetchProducts = createAsyncThunk<Product[], void>("products/fetchProducts", async () => {
	const response = await getProducts();
	return response.data;
});

export const addProduct = createAsyncThunk<Product, ProductData>("products/addProduct", async (productData) => {
	const formData = new FormData();
	Object.entries(productData).forEach(([key, value]) => {
		formData.append(key, value.toString());
	});
	const response = await createProduct(formData);
	return response.data;
});

export const editProduct = createAsyncThunk<Product, { id: string; productData: ProductData }>(
	"products/editProduct",
	async ({ id, productData }) => {
		const formData = new FormData();
		Object.entries(productData).forEach(([key, value]) => {
			formData.append(key, value.toString());
		});
		const response = await updateProduct(id, formData);
		return response.data;
	},
);

export const removeProduct = createAsyncThunk<string, string>("products/removeProduct", async (id) => {
	await deleteProduct(id);
	return id;
});

const productSlice = createSlice({
	name: "products",
	initialState: {
		products: [] as Product[],
		status: "idle" as "idle" | "loading" | "succeeded" | "failed",
		error: null as string | null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
				state.status = "succeeded";
				state.products = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message || null;
			})
			.addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
				state.products.push(action.payload);
			})
			.addCase(editProduct.fulfilled, (state, action: PayloadAction<Product>) => {
				const index = state.products.findIndex((p) => p._id === action.payload._id);
				if (index !== -1) {
					state.products[index] = action.payload;
				}
			})
			.addCase(removeProduct.fulfilled, (state, action: PayloadAction<string>) => {
				state.products = state.products.filter((p) => p._id !== action.payload);
			});
	},
});

export default productSlice.reducer;
