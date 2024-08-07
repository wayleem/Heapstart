import { Request, Response } from "express";
import Order from "../models/Order";
import { OrderErrors } from "../utils/errors";
import { sendOrderConfirmationEmail } from "../services/emailService";

export const createOrder = async (req: Request, res: Response) => {
	try {
		const { products, shippingAddress, paymentInfo } = req.body;
		const userId = req.userId; // Assuming you set this in your auth middleware

		const newOrder = new Order({
			userId,
			products,
			shippingAddress,
			orderTotal: products.reduce((total: number, item: any) => total + item.price * item.quantity, 0),
			status: "pending",
		});

		await newOrder.save();

		// Send order confirmation email
		await sendOrderConfirmationEmail(req.user.email, newOrder);

		res.status(201).json(newOrder);
	} catch (error) {
		console.error("Error creating order:", error);
		res.status(500).json({ message: "Error creating order", error });
	}
};

export const getOrder = async (req: Request, res: Response) => {
	// Implement get single order logic
};

export const updateOrderStatus = async (req: Request, res: Response) => {
	// Implement order status update logic
};

export const getUserOrders = async (req: Request, res: Response) => {
	// Implement get user orders logic
};

// Add more order-related controller functions as needed
