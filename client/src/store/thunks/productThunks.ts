import { createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../../api/endpoints";
import { handleApiError, log } from "../../utils/errorUtils";
import { Product } from "@types";

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
	"products/fetchProducts",
	async (_, { rejectWithValue }) => {
		try {
			return await productApi.getAllProducts();
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to fetch products", { error: errorMessage });
			return rejectWithValue(errorMessage);
		}
	},
);
