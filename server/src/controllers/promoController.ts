import { Request, Response } from "express";
import PromoCode from "../models/PromoCode";
import { createCrudController } from "./crudController";

const promoCrud = createCrudController(PromoCode);

export const promoController = {
	...promoCrud,

	validate: async (req: Request, res: Response) => {
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
	},
};
