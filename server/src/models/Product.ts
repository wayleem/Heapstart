import { Schema, model, Model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  supplier_id: string;
  supplier_cost: number;
  supplier_link: string;
  category?: string;
  images: string[];
  isActive: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    supplier_id: { type: String, required: true, trim: true },
    supplier_cost: { type: Number, required: true, min: 0 },
    supplier_link: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    images: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 1, category: 1 });
ProductSchema.index({ supplier_id: 1 });

const Product: Model<IProduct> = model<IProduct>("Product", ProductSchema);

export default Product;
