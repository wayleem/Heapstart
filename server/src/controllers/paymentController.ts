import { Request, Response } from "express";
import Product from "../models/Product";
import stripe from "../config/stripe";

export const paymentController = {
	processPayment: async (req: Request, res: Response) => {
		const { paymentMethodId, amount } = req.body;
		try {
			const paymentIntent = await stripe.paymentIntents.create({
				amount: amount * 100,
				currency: "usd",
				payment_method: paymentMethodId,
				confirm: true,
			});
			res.json({ success: true, paymentIntentId: paymentIntent.id });
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	},

	createPaymentIntent: async (req: Request, res: Response) => {
		try {
			const { items } = req.body;
			if (!items || !Array.isArray(items) || items.length === 0) {
				return res.status(400).json({ error: "Invalid or empty items array" });
			}

			const productIds = items.map((item: any) => item.productId);
			const products = await Product.find({ _id: { $in: productIds } });

			let amount = items.reduce((total, item) => {
				const product = products.find((p) => p._id.toString() === item.productId);
				if (!product) {
					throw new Error(`Invalid product: ${item.productId}`);
				}
				return total + product.price * item.quantity;
			}, 0);

			const paymentIntent = await stripe.paymentIntents.create({
				amount: Math.round(amount * 100),
				currency: "usd",
				automatic_payment_methods: { enabled: true },
			});

			res.json({ clientSecret: paymentIntent.client_secret });
		} catch (error) {
			res.status(500).json({
				error: "An error occurred while creating the payment intent",
				details: error instanceof Error ? error.message : String(error),
			});
		}
	},
};
