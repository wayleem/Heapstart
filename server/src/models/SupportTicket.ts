import { Schema, model, Document, Model } from "mongoose";

export interface ISupportTicket extends Document {
	userId: Schema.Types.ObjectId;
	subject: string;
	message: string;
	status: "open" | "closed" | "pending";
	createdAt: Date;
	updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		subject: { type: String, required: true, trim: true },
		message: { type: String, required: true, trim: true },
		status: { type: String, enum: ["open", "closed", "pending"], default: "open" },
	},
	{ timestamps: true },
);

const SupportTicket: Model<ISupportTicket> = model<ISupportTicket>("SupportTicket", SupportTicketSchema);
export default SupportTicket;
