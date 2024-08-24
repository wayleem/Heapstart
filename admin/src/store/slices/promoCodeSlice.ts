// src/store/slices/promoCodeSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PromoCode, PromoCodeState } from "@types";

const initialState: PromoCodeState = {
	items: [],
	status: "idle",
	error: null,
};

const promoCodeSlice = createSlice({
	name: "promoCodes",
	initialState,
	reducers: {
		setPromoCodes: (state, action: PayloadAction<PromoCode[]>) => {
			state.items = action.payload;
		},
		addPromoCode: (state, action: PayloadAction<PromoCode>) => {
			state.items.push(action.payload);
		},
		// Rename this action to updatePromoCodeInState
		updatePromoCodeInState: (state, action: PayloadAction<PromoCode>) => {
			const index = state.items.findIndex((item) => item._id === action.payload._id);
			if (index !== -1) {
				state.items[index] = action.payload;
			}
		},
		removePromoCode: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((item) => item._id !== action.payload);
		},
		setPromoCodeStatus: (state, action: PayloadAction<"idle" | "loading" | "succeeded" | "failed">) => {
			state.status = action.payload;
		},
		setPromoCodeError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},
});

export const {
	setPromoCodes,
	addPromoCode,
	updatePromoCodeInState, // Export the renamed action
	removePromoCode,
	setPromoCodeStatus,
	setPromoCodeError,
} = promoCodeSlice.actions;

export default promoCodeSlice.reducer;
