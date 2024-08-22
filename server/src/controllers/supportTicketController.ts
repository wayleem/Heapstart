import { Request, Response } from "express";
import SupportTicket from "../models/SupportTicket";
import User from "../models/User";

export const createSupportTicket = async (req: Request, res: Response) => {
	try {
		const { orderId, subject, description } = req.body as CreateSupportTicketDTO;
		const userId = req.userId;

		const newTicket = new SupportTicket({
			userId,
			orderId,
			subject,
			description,
		});

		await newTicket.save();

		await User.findByIdAndUpdate(userId, {
			$push: { supportTickets: newTicket._id },
		});

		res.status(201).json(newTicket);
	} catch (error) {
		res.status(500).json({ message: "Error creating support ticket", error });
	}
};

export const getUserSupportTickets = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId).populate("supportTickets").exec();

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user.supportTickets);
	} catch (error) {
		res.status(500).json({ message: "Error fetching support tickets", error });
	}
};

export const getSupportTicket = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const ticket = await SupportTicket.findById(id);
		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}
		res.json(ticket);
	} catch (error) {
		res.status(500).json({ message: "Error fetching support ticket", error });
	}
};

export const updateSupportTicket = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { status, adminResponse } = req.body;
		const updatedTicket = await SupportTicket.findByIdAndUpdate(id, { status, adminResponse }, { new: true });
		if (!updatedTicket) {
			return res.status(404).json({ message: "Ticket not found" });
		}
		res.json(updatedTicket);
	} catch (error) {
		res.status(500).json({ message: "Error updating support ticket", error });
	}
};

export const getAllSupportTickets = async (req: Request, res: Response) => {
	try {
		const tickets = await SupportTicket.find().sort({ createdAt: -1 });
		res.json(tickets);
	} catch (error) {
		console.error("Error fetching support tickets:", error);
		res.status(500).json({ message: "Error fetching support tickets", error: (error as Error).message });
	}
};

export const deleteSupportTicket = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = req.userId;

		const ticket = await SupportTicket.findOne({ _id: id, userId });

		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found or you don't have permission to delete it" });
		}

		await SupportTicket.deleteOne({ _id: id });

		// Remove the ticket from the user's supportTickets array
		await User.findByIdAndUpdate(userId, {
			$pull: { supportTickets: id },
		});

		res.json({ message: "Support ticket deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting support ticket", error });
	}
};
