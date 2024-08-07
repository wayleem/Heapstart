import { Request, Response } from "express";
import Product from "../models/Product";
import stripe from "../config/stripe";

export const processPayment = async (req: Request, res: Response) => {
	const { paymentMethodId, amount } = req.body;

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount * 100, // Stripe expects amount in cents
			currency: "usd",
			payment_method: paymentMethodId,
			confirm: true,
		});

		res.json({ success: true, paymentIntentId: paymentIntent.id });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

export const createPaymentIntent = async (req: Request, res: Response) => {
	try {
		console.log("Received request body:", req.body);
		const { items } = req.body;

		if (!items || !Array.isArray(items) || items.length === 0) {
			return res.status(400).json({ error: "Invalid or empty items array" });
		}

		// Fetch products from MongoDB
		const productIds = items.map((item: any) => item.productId);
		console.log("Product IDs:", productIds);
		const products = await Product.find({ _id: { $in: productIds } });
		console.log("Found products:", products);

		// Calculate total amount
		let amount = 0;
		for (const item of items) {
			const product = products.find((p) => p._id.toString() === item.productId);
			if (!product) {
				console.log(`Product not found for ID: ${item.productId}`);
				return res.status(400).json({ error: `Invalid product: ${item.productId}` });
			}
			amount += product.price * item.quantity;
		}
		console.log("Calculated amount:", amount);

		// Create a PaymentIntent with the order amount and currency
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(amount * 100), // Stripe expects amount in cents
			currency: "usd",
			automatic_payment_methods: {
				enabled: true,
			},
		});

		console.log("Created PaymentIntent:", paymentIntent.id);

		res.json({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		console.error("Error creating payment intent:", error);
		res.status(500).json({
			error: "An error occurred while creating the payment intent",
			details: error instanceof Error ? error.message : String(error),
		});
	}
};
