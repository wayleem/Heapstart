import { Request, Response } from "express";
import Order from "../models/Order";
import { startSession } from "mongoose";
import User from "../models/User";
import Product from "../models/Product";

export const createOrder = async (req: Request, res: Response) => {
	const session = await startSession();
	session.startTransaction();

	try {
		const { products, shippingAddress, paymentInfo, orderTotal, appliedDiscount } = req.body;
		const userId = req.userId;

		// Fetch product details for each product in the order
		const productDetails = await Promise.all(
			products.map(async (product: { productId: string; quantity: number; price: number }) => {
				const productDoc = await Product.findById(product.productId);
				if (!productDoc) {
					throw new Error(`Product not found: ${product.productId}`);
				}
				return {
					...product,
					name: productDoc.name,
					images: productDoc.images,
				};
			}),
		);

		const newOrder = new Order({
			userId,
			products: productDetails,
			shippingAddress,
			paymentInfo,
			orderTotal,
			appliedDiscount,
			status: "processing",
		});

		const savedOrder = await newOrder.save({ session });

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
	try {
		const { id } = req.params;
		const { status } = req.body;

		const order = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.json(order);
	} catch (error) {
		console.error("Error updating order status:", error);
		res.status(500).json({ message: "Error updating order status", error: error.message });
	}
};

export const updateOrderTracking = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { productId, trackingInfo } = req.body;

		const order = await Order.findById(id);

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		const updatedOrder = await Order.findOneAndUpdate(
			{ _id: id },
			{
				$set: {
					trackingInfo: [
						...order.trackingInfo.filter((t) => t.productId.toString() !== productId),
						{ productId, ...trackingInfo },
					],
				},
			},
			{ new: true, runValidators: true },
		);

		if (!updatedOrder) {
			return res.status(404).json({ message: "Failed to update order" });
		}

		res.json(updatedOrder);
	} catch (error) {
		console.error("Error updating order tracking:", error);
		res.status(500).json({ message: "Error updating order tracking", error: error.message });
	}
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

export const getAllOrders = async (req: Request, res: Response) => {
	try {
		const orders = await Order.find().sort({ createdAt: -1 });
		res.json(orders);
	} catch (error) {
		console.error("Error fetching all orders:", error);
		res.status(500).json({ message: "Error fetching orders", error: error.message });
	}
};
