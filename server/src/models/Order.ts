import { Schema, model, Model, Document } from "mongoose";

export interface IOrder extends Document {
	userId: Schema.Types.ObjectId;
	products: Array<{
		productId: Schema.Types.ObjectId;
		quantity: number;
		price: number;
	}>;
	orderTotal: number;
	shippingAddress: {
		firstName: string;
		lastName: string;
		street: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
	};
	paymentInfo: {
		paymentMethodId: string;
	};
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	trackingNumber?: string;
	trackingNumbers?: Array<{
		productId: Schema.Types.ObjectId;
		trackingNumber: string;
	}>;
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
		shippingAddress: {
			firstName: { type: String, required: true, trim: true },
			lastName: { type: String, required: true, trim: true },
			street: { type: String, required: true, trim: true },
			city: { type: String, required: true, trim: true },
			state: { type: String, required: true, trim: true },
			postalCode: { type: String, required: true, trim: true },
			country: { type: String, required: true, trim: true },
		},
		paymentInfo: {
			paymentMethodId: { type: String, required: true },
		},
		status: {
			type: String,
			enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
			required: true,
			default: "pending",
		},
		trackingNumber: { type: String },
		trackingNumbers: [
			{
				productId: { type: Schema.Types.ObjectId, ref: "Product" },
				trackingNumber: { type: String, trim: true },
			},
		],
	},
	{ timestamps: true },
);

OrderSchema.index({ userId: 1, createdAt: -1 });

const Order: Model<IOrder> = model<IOrder>("Order", OrderSchema);

export default Order;
