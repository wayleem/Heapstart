import { Request, Response } from "express";
import Order from "../models/Order";
import { OrderErrors } from "../utils/errors";
import { sendOrderConfirmationEmail } from "../services/emailService";

export const createOrder = async (req: Request, res: Response) => {
	try {
		const { products, shippingAddress, paymentInfo, orderTotal } = req.body;
		const userId = req.userId; // Assuming you set this in your auth middleware

		console.log("Received order data:", { products, shippingAddress, paymentInfo, orderTotal, userId });

		const newOrder = new Order({
			userId,
			products,
			shippingAddress,
			paymentInfo,
			orderTotal,
			status: "processing",
		});

		const savedOrder = await newOrder.save();
		console.log("Saved order:", savedOrder);

		res.status(201).json(savedOrder);
	} catch (error) {
		console.error("Error creating order:", error);
		res.status(500).json({ message: "Error creating order", error: error.message });
	}
};

export const getOrder = async (req: Request, res: Response) => {
	// Implement get single order logic
};

export const updateOrderStatus = async (req: Request, res: Response) => {
	// Implement order status update logic
};

export const getUserOrders = async (req: Request, res: Response) => {
	try {
		const userId = req.userId; // Assuming you have middleware that sets userId
		const orders = await Order.find({ userId }).sort({ createdAt: -1 });
		res.json(orders);
	} catch (error) {
		console.error("Error fetching user orders:", error);
		res.status(500).json({ message: "Error fetching user orders", error });
	}
};

// Add more order-related controller functions as needed
