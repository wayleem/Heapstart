// src/store/thunks/promoCodeThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { promoCodeApi } from "@api/endpoints";
import { setPromoCode, setPromoCodeError } from "../slices/promoCodeSlice";

export const validatePromoCode = createAsyncThunk("promoCode/validate", async (code: string, { dispatch }) => {
	try {
		const response = await promoCodeApi.validatePromoCode(code);
		if (response.isValid) {
			dispatch(
				setPromoCode({
					code,
					discountType: response.discountType,
					discountValue: response.discountValue,
				}),
			);
		} else {
			dispatch(setPromoCodeError("Invalid promo code"));
		}
	} catch (error) {
		dispatch(setPromoCodeError("Error validating promo code"));
	}
});
