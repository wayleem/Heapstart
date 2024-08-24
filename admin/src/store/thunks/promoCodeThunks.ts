// src/store/thunks/promoCodeThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { promoCodeApi } from "@api/endpoints";
import { handleApiError, log } from "@utils/errorUtils";
import {
	setPromoCodes,
	addPromoCode,
	removePromoCode,
	setPromoCodeStatus,
	setPromoCodeError,
	updatePromoCodeInState,
} from "../slices/promoCodeSlice";
import { PromoCode } from "@types";

export const fetchPromoCodes = createAsyncThunk("promoCodes/fetchPromoCodes", async (_, { dispatch }) => {
	try {
		dispatch(setPromoCodeStatus("loading"));
		const promoCodes = await promoCodeApi.getAllPromoCodes();
		dispatch(setPromoCodes(promoCodes));
		dispatch(setPromoCodeStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Failed to fetch promo codes", { error: errorMessage });
		dispatch(setPromoCodeError(errorMessage));
		dispatch(setPromoCodeStatus("failed"));
		throw err;
	}
});

export const createPromoCode = createAsyncThunk(
	"promoCodes/createPromoCode",
	async (promoCodeData: Partial<PromoCode>, { dispatch }) => {
		try {
			dispatch(setPromoCodeStatus("loading"));
			const newPromoCode = await promoCodeApi.createPromoCode(promoCodeData);
			dispatch(addPromoCode(newPromoCode));
			dispatch(setPromoCodeStatus("succeeded"));
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to create promo code", { error: errorMessage });
			dispatch(setPromoCodeError(errorMessage));
			dispatch(setPromoCodeStatus("failed"));
			throw err;
		}
	},
);

export const updatePromoCode = createAsyncThunk(
	"promoCodes/updatePromoCode",
	async ({ id, promoCodeData }: { id: string; promoCodeData: Partial<PromoCode> }, { dispatch }) => {
		try {
			dispatch(setPromoCodeStatus("loading"));
			const updatedPromoCode = await promoCodeApi.updatePromoCode(id, promoCodeData);
			dispatch(updatePromoCodeInState(updatedPromoCode)); // Use the renamed action here
			dispatch(setPromoCodeStatus("succeeded"));
		} catch (err) {
			const errorMessage = handleApiError(err);
			log("error", "Failed to update promo code", { error: errorMessage });
			dispatch(setPromoCodeError(errorMessage));
			dispatch(setPromoCodeStatus("failed"));
			throw err;
		}
	},
);

export const deletePromoCode = createAsyncThunk("promoCodes/deletePromoCode", async (id: string, { dispatch }) => {
	try {
		dispatch(setPromoCodeStatus("loading"));
		await promoCodeApi.deletePromoCode(id);
		dispatch(removePromoCode(id));
		dispatch(setPromoCodeStatus("succeeded"));
	} catch (err) {
		const errorMessage = handleApiError(err);
		log("error", "Failed to delete promo code", { error: errorMessage });
		dispatch(setPromoCodeError(errorMessage));
		dispatch(setPromoCodeStatus("failed"));
		throw err;
	}
});
