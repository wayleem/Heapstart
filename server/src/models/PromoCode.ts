// src/models/PromoCode.ts

import { Schema, model, Document } from "mongoose";

export interface IPromoCode extends Document {
	code: string;
	discountType: "percentage" | "fixed";
	discountValue: number;
	validFrom: Date;
	validUntil: Date;
	usageLimit: number;
	usageCount: number;
	isActive: boolean;
}

const PromoCodeSchema = new Schema<IPromoCode>(
	{
		code: { type: String, required: true, unique: true },
		discountType: { type: String, enum: ["percentage", "fixed"], required: true },
		discountValue: { type: Number, required: true },
		validFrom: { type: Date, required: true },
		validUntil: { type: Date, required: true },
		usageLimit: { type: Number, required: true },
		usageCount: { type: Number, default: 0 },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

const PromoCode = model<IPromoCode>("PromoCode", PromoCodeSchema);

export default PromoCode;
