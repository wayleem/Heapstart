import { Schema, model, Document, Model } from "mongoose";

export interface IProduct extends Document {
	name: string;
	description?: string;
	components: Array<{
		componentName: string;
		quantity: number;
	}>;
	price: number;
	images: string[];
	isActive: boolean;
	category?: string;
}

const ProductSchema = new Schema<IProduct>(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, trim: true },
		components: [
			{
				componentName: { type: String, required: true, trim: true },
				quantity: { type: Number, required: true, min: 1 },
			},
		],
		price: { type: Number, required: true, min: 0 },
		images: [{ type: String, trim: true }],
		isActive: { type: Boolean, default: true },
		category: { type: String, trim: true },
	},
	{ timestamps: true },
);

const Product: Model<IProduct> = model<IProduct>("Product", ProductSchema);
export default Product;
