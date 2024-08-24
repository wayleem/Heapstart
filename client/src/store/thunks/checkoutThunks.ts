// src/store/thunks/checkoutThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { promoCodeApi } from "@api/endpoints";
import { handleApiError, log } from "@utils/errorUtils";

export const validatePromoCode = createAsyncThunk(
	"checkout/validatePromoCode",
	async (code: string, { rejectWithValue }) => {
		try {
			const response = await promoCodeApi.validatePromoCode(code);
			return response;
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to validate promo code", { error: errorMessage });
			return rejectWithValue(errorMessage);
		}
	},
);
