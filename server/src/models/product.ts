import { Schema, model } from "mongoose";

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  supplier_id: { type: String, required: true, trim: true },
  supplier_cost: { type: Number, required: true, min: 0 },
  supplier_link: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  imageUrl: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

ProductSchema.index({ name: 1, category: 1 });
ProductSchema.index({ supplier_id: 1 });

export const ProductModel = model<IProduct>("Product", ProductSchema, "products");
