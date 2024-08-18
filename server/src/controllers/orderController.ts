import { Request, Response } from "express";
import Order from "../models/Order";
import { startSession } from "mongoose";
import User from "../models/User";

export const createOrder = async (req: Request, res: Response) => {
	const session = await startSession();
	session.startTransaction();

	try {
		const { products, shippingAddress, paymentInfo, orderTotal } = req.body;
		const userId = req.userId;

		console.log("Received order data:", { products, shippingAddress, paymentInfo, orderTotal, userId });

		const newOrder = new Order({
			userId,
			products,
			shippingAddress,
			paymentInfo,
			orderTotal,
			status: "processing",
		});

		const savedOrder = await newOrder.save({ session });
		console.log("Saved order:", savedOrder);

		// Update user's orderHistory
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $push: { orderHistory: savedOrder._id } },
			{ new: true, session },
		);

		if (!updatedUser) {
			throw new Error("User not found");
		}

		await session.commitTransaction();
		session.endSession();

		res.status(201).json(savedOrder);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		console.error("Error creating order:", error);
		res.status(500).json({ message: "Error creating order", error: error.message });
	}
};

export const getOrder = async (req: Request, res: Response) => {
	try {
		const { id } = req.params; // Get the order ID from the request parameters
		const userId = req.userId; // Assuming you set this in your auth middleware

		// Find the order by ID and user ID
		const order = await Order.findOne({ _id: id, userId: userId });

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		// Optionally, you can populate related fields if needed
		// For example, if you want to include product details:
		// await order.populate('products.productId').execPopulate();

		res.status(200).json(order);
	} catch (error) {
		console.error("Error getting order:", error);
		res.status(500).json({ message: "Error getting order", error: error.message });
	}
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
