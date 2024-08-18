import { Schema, model, Model, Document, Types } from "mongoose";

export interface ISupportTicket extends Document {
	userId: Types.ObjectId;
	orderId: Types.ObjectId;
	subject: string;
	description: string;
	status: "open" | "in-progress" | "resolved" | "closed";
	createdAt: Date;
	updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
		subject: { type: String, required: true },
		description: { type: String, required: true },
		status: { type: String, enum: ["open", "in-progress", "resolved", "closed"], default: "open" },
	},
	{ timestamps: true },
);

const SupportTicket: Model<ISupportTicket> = model<ISupportTicket>("SupportTicket", SupportTicketSchema);

export default SupportTicket;
