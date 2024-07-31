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
