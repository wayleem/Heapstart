import { Request, Response } from "express";
import SupportTicket from "../models/SupportTicket";
import User from "../models/User";
import { createCrudController } from "./crudController";

const ticketCrud = createCrudController(SupportTicket);

export const ticketController = {
	...ticketCrud,

	// Override the add method to include user-specific logic
	add: async (req: Request, res: Response) => {
		try {
			const { orderId, subject, description } = req.body;
			const userId = req.userId;
			const newTicket = new SupportTicket({ userId, orderId, subject, description });
			await newTicket.save();
			await User.findByIdAndUpdate(userId, { $push: { supportTickets: newTicket._id } });
			res.status(201).json(newTicket);
		} catch (error) {
			res.status(500).json({ message: "Error creating support ticket", error });
		}
	},

	// Override the remove method to include user-specific logic
	remove: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const userId = req.userId;
			const ticket = await SupportTicket.findOneAndDelete({ _id: id, userId });
			if (!ticket) {
				return res.status(404).json({ message: "Ticket not found or you don't have permission to delete it" });
			}
			await User.findByIdAndUpdate(userId, { $pull: { supportTickets: id } });
			res.json({ message: "Support ticket deleted successfully" });
		} catch (error) {
			res.status(500).json({ message: "Error deleting support ticket", error });
		}
	},
};
