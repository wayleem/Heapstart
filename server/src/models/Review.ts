import { Schema, model, Document, Model } from "mongoose";

export interface IReview extends Document {
	userId: Schema.Types.ObjectId;
	productId: Schema.Types.ObjectId;
	rating: number;
	comment: string;
	createdAt: Date;
	updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, required: true, trim: true },
	},
	{ timestamps: true },
);

const Review: Model<IReview> = model<IReview>("Review", ReviewSchema);
export default Review;
