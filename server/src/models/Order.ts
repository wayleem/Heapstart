import { Schema, model, Document, Model } from "mongoose";
import { AddressSchema, IAddress } from "./Address";

export interface IOrder extends Document {
	userId: Schema.Types.ObjectId;
	products: Array<{
		productId: Schema.Types.ObjectId;
		quantity: number;
		price: number;
	}>;
	orderTotal: number;
	shippingAddress: IAddress;
	paymentInfo: {
		paymentMethodId: string;
	};
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	trackingInfo: {
		carrier: string;
		trackingNumber: string;
		trackingLink?: string;
	};
	appliedDiscount?: number;
	createdAt: Date;
	updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		products: [
			{
				productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
				quantity: { type: Number, required: true, min: 1 },
				price: { type: Number, required: true, min: 0 },
			},
		],
		orderTotal: { type: Number, required: true, min: 0 },
		shippingAddress: AddressSchema,
		paymentInfo: {
			paymentMethodId: { type: String, required: true },
		},
		status: {
			type: String,
			enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
			required: true,
			default: "pending",
		},
		trackingInfo: {
			carrier: { type: String, required: true },
			trackingNumber: { type: String, required: true },
			trackingLink: { type: String },
		},
		appliedDiscount: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

const Order: Model<IOrder> = model<IOrder>("Order", OrderSchema);
export default Order;
