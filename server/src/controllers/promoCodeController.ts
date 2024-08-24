// src/controllers/promoCodeController.ts

import { Request, Response } from "express";
import PromoCode from "../models/PromoCode";

export const createPromoCode = async (req: Request, res: Response) => {
	try {
		const newPromoCode = new PromoCode(req.body);
		await newPromoCode.save();
		res.status(201).json(newPromoCode);
	} catch (error) {
		res.status(400).json({ message: "Error creating promo code", error });
	}
};

export const getAllPromoCodes = async (req: Request, res: Response) => {
	try {
		const promoCodes = await PromoCode.find();
		res.json(promoCodes);
	} catch (error) {
		res.status(500).json({ message: "Error fetching promo codes", error });
	}
};

export const updatePromoCode = async (req: Request, res: Response) => {
	try {
		const updatedPromoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updatedPromoCode) {
			return res.status(404).json({ message: "Promo code not found" });
		}
		res.json(updatedPromoCode);
	} catch (error) {
		res.status(400).json({ message: "Error updating promo code", error });
	}
};

export const deletePromoCode = async (req: Request, res: Response) => {
	try {
		const deletedPromoCode = await PromoCode.findByIdAndDelete(req.params.id);
		if (!deletedPromoCode) {
			return res.status(404).json({ message: "Promo code not found" });
		}
		res.json({ message: "Promo code deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting promo code", error });
	}
};

export const validatePromoCode = async (req: Request, res: Response) => {
	try {
		const { code } = req.body;
		const promoCode = await PromoCode.findOne({ code, isActive: true });

		if (!promoCode) {
			return res.status(404).json({ message: "Invalid promo code" });
		}

		const now = new Date();
		if (now < promoCode.validFrom || now > promoCode.validUntil) {
			return res.status(400).json({ message: "Promo code is not valid at this time" });
		}

		if (promoCode.usageCount >= promoCode.usageLimit) {
			return res.status(400).json({ message: "Promo code usage limit reached" });
		}

		res.json({
			isValid: true,
			discountType: promoCode.discountType,
			discountValue: promoCode.discountValue,
		});
	} catch (error) {
		res.status(500).json({ message: "Error validating promo code", error });
	}
};
