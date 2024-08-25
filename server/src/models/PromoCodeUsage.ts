import { Schema, model, Document, Model } from "mongoose";

export interface IPromoCodeUsage extends Document {
	promoCodeId: Schema.Types.ObjectId;
	userId: Schema.Types.ObjectId;
	orderId: Schema.Types.ObjectId;
	usedAt: Date;
}

const PromoCodeUsageSchema = new Schema<IPromoCodeUsage>(
	{
		promoCodeId: { type: Schema.Types.ObjectId, ref: "PromoCode", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
		usedAt: { type: Date, required: true, default: Date.now },
	},
	{ timestamps: true },
);

const PromoCodeUsage: Model<IPromoCodeUsage> = model<IPromoCodeUsage>("PromoCodeUsage", PromoCodeUsageSchema);
export default PromoCodeUsage;
