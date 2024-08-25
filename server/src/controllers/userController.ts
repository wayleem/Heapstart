import User from "../models/User";
import Product from "../models/Product"; // Assuming you have a Product model
import { createCrudController } from "./crudController";
import { Request, Response, NextFunction } from "express";
import { createErrorResponse, UserErrors, CommonErrors } from "../utils/errors";
import logger from "../utils/logger";

const userCrud = createCrudController(User);

export const userController = {
	...userCrud,

	// Get user's cart
	getCart: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.userId; // Assuming you set this in your auth middleware
			const user = await User.findById(userId).populate("cart.productId");
			if (!user) {
				return next(createErrorResponse(UserErrors.NO_USER_FOUND, "User not found", 404));
			}
			logger.info(`Retrieved cart for user`, { userId });
			res.json(user.cart);
		} catch (error) {
			logger.error("Error retrieving user cart", { error, userId: req.userId });
			next(createErrorResponse(CommonErrors.SERVER_ERROR, "Error retrieving cart", 500, error));
		}
	},

	// Add item to cart
	addToCart: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.userId;
			const { productId, quantity } = req.body;

			// Validate product exists
			const product = await Product.findById(productId);
			if (!product) {
				return next(createErrorResponse(CommonErrors.NOT_FOUND, "Product not found", 404));
			}

			const user = await User.findById(userId);
			if (!user) {
				return next(createErrorResponse(UserErrors.NO_USER_FOUND, "User not found", 404));
			}

			// Check if product already in cart
			const cartItemIndex = user.cart.findIndex((item) => item.productId.toString() === productId);

			if (cartItemIndex > -1) {
				// Update quantity if product already in cart
				user.cart[cartItemIndex].quantity += quantity;
			} else {
				// Add new product to cart
				user.cart.push({ productId, quantity });
			}

			await user.save();
			logger.info(`Added item to cart for user`, { userId, productId, quantity });
			res.json(user.cart);
		} catch (error) {
			logger.error("Error adding item to cart", { error, userId: req.userId });
			next(createErrorResponse(CommonErrors.SERVER_ERROR, "Error adding item to cart", 500, error));
		}
	},

	// Update cart item quantity
	updateCartItem: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.userId;
			const { productId, quantity } = req.body;

			const user = await User.findById(userId);
			if (!user) {
				return next(createErrorResponse(UserErrors.NO_USER_FOUND, "User not found", 404));
			}

			const cartItemIndex = user.cart.findIndex((item) => item.productId.toString() === productId);

			if (cartItemIndex === -1) {
				return next(createErrorResponse(CommonErrors.NOT_FOUND, "Product not found in cart", 404));
			}

			if (quantity > 0) {
				user.cart[cartItemIndex].quantity = quantity;
			} else {
				// Remove item if quantity is 0 or negative
				user.cart.splice(cartItemIndex, 1);
			}

			await user.save();
			logger.info(`Updated cart item for user`, { userId, productId, quantity });
			res.json(user.cart);
		} catch (error) {
			logger.error("Error updating cart item", { error, userId: req.userId });
			next(createErrorResponse(CommonErrors.SERVER_ERROR, "Error updating cart item", 500, error));
		}
	},

	// Remove item from cart
	removeFromCart: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.userId;
			const { productId } = req.params;

			const user = await User.findById(userId);
			if (!user) {
				return next(createErrorResponse(UserErrors.NO_USER_FOUND, "User not found", 404));
			}

			const cartItemIndex = user.cart.findIndex((item) => item.productId.toString() === productId);

			if (cartItemIndex === -1) {
				return next(createErrorResponse(CommonErrors.NOT_FOUND, "Product not found in cart", 404));
			}

			user.cart.splice(cartItemIndex, 1);
			await user.save();
			logger.info(`Removed item from cart for user`, { userId, productId });
			res.json(user.cart);
		} catch (error) {
			logger.error("Error removing item from cart", { error, userId: req.userId });
			next(createErrorResponse(CommonErrors.SERVER_ERROR, "Error removing item from cart", 500, error));
		}
	},

	// Clear cart
	clearCart: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.userId;

			const user = await User.findById(userId);
			if (!user) {
				return next(createErrorResponse(UserErrors.NO_USER_FOUND, "User not found", 404));
			}

			user.cart = [];
			await user.save();
			logger.info(`Cleared cart for user`, { userId });
			res.json({ message: "Cart cleared successfully" });
		} catch (error) {
			logger.error("Error clearing cart", { error, userId: req.userId });
			next(createErrorResponse(CommonErrors.SERVER_ERROR, "Error clearing cart", 500, error));
		}
	},
};
