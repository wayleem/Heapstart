import { Schema, model, Model, Document } from "mongoose";

export interface IOrder extends Document {
	userId: Schema.Types.ObjectId;
	products: ProductInOrder[];
	orderTotal: number;
	orderDate: Date;
	shippingAddress: Address;
	trackingNumber?: string;
	trackingNumbers: TrackingNumber[];
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
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
		orderDate: { type: Date, default: Date.now, immutable: true },
		shippingAddress: {
			street: { type: String, required: true, trim: true },
			city: { type: String, required: true, trim: true },
			state: { type: String, required: true, trim: true },
			postalCode: { type: String, required: true, trim: true },
			country: { type: String, required: true, trim: true },
		},
		trackingNumber: { type: String },
		trackingNumbers: [
			{
				productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
				trackingNumber: { type: String, required: true, trim: true },
			},
		],
		status: {
			type: String,
			enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
			required: true,
			default: "pending",
		},
	},
	{ timestamps: true },
);

OrderSchema.index({ userId: 1, orderDate: -1 });

const Order: Model<IOrder> = model<IOrder>("Order", OrderSchema);

export default Order;
