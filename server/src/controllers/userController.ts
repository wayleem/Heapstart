import { Request, Response } from "express";
import User from "../models/User";
import { UserErrors } from "../utils/errors";

export const getProfile = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.userId).select("-passwordHash");
		if (!user) {
			return res.status(404).json({ type: UserErrors.NO_USER_FOUND });
		}
		res.json(user); // Send the entire user object
	} catch (err) {
		console.error("Profile fetch error:", err);
		res.status(500).json({
			type: UserErrors.SERVER_ERROR,
			message: "An error occurred while fetching the profile",
		});
	}
};

export const updateProfile = async (req: Request, res: Response) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.userId,
			{ $set: { profile: req.body.profile } },
			{ new: true, runValidators: true },
		).select("-passwordHash");
		if (!updatedUser) {
			return res.status(404).json({ type: UserErrors.NO_USER_FOUND });
		}
		res.json(updatedUser);
	} catch (err) {
		console.error("Profile update error:", err);
		res.status(500).json({
			type: UserErrors.SERVER_ERROR,
			message: "An error occurred while updating the profile",
		});
	}
};

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find().select("-passwordHash");
		res.json(users);
	} catch (err) {
		console.error("Fetch all users error:", err);
		res.status(500).json({ type: UserErrors.SERVER_ERROR, message: "An error occurred while fetching users" });
	}
};

export const updateCart = async (req: Request, res: Response) => {
	try {
		const userId = req.userId; // Assuming you have middleware that sets this
		const { cart } = req.body;

		const updatedUser = await User.findByIdAndUpdate(userId, { cart }, { new: true });

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({ cart: updatedUser.cart });
	} catch (error) {
		res.status(500).json({ message: "Error updating cart", error });
	}
};

export const getCart = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({ cart: user.cart });
	} catch (error) {
		res.status(500).json({ message: "Error fetching cart", error });
	}
};
