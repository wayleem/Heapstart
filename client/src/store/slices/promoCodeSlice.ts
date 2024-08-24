// src/store/slices/promoCodeSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PromoCodeState } from "@types";

const initialState: PromoCodeState = {
	code: null,
	discountType: null,
	discountValue: null,
	error: null,
};

const promoCodeSlice = createSlice({
	name: "promoCode",
	initialState,
	reducers: {
		setPromoCode: (
			state,
			action: PayloadAction<{ code: string; discountType: "percentage" | "fixed"; discountValue: number }>,
		) => {
			state.code = action.payload.code;
			state.discountType = action.payload.discountType;
			state.discountValue = action.payload.discountValue;
			state.error = null;
		},
		clearPromoCode: (state) => {
			state.code = null;
			state.discountType = null;
			state.discountValue = null;
			state.error = null;
		},
		setPromoCodeError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
		},
	},
});

export const { setPromoCode, clearPromoCode, setPromoCodeError } = promoCodeSlice.actions;
export default promoCodeSlice.reducer;
