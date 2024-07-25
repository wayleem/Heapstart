import express from "express";
import UserModel from "../models/user";
import { UserErrors } from "../errors";
import { authenticateJWT, isAdmin } from "../middleware/auth";
import { validateUserUpdate } from "../middleware/user";

const router = express.Router();

router.get("/profile", authenticateJWT, async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId).select("-passwordHash");
		if (!user) {
			return res.status(404).json({ type: UserErrors.NO_USER_FOUND });
		}
		res.json(user);
	} catch (err) {
		console.error("Profile fetch error:", err);
		res.status(500).json({
			type: UserErrors.SERVER_ERROR,
			message: "An error occurred while fetching the profile",
		});
	}
});

router.put("/profile", authenticateJWT, validateUserUpdate, async (req, res) => {
	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
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
});

router.get("/all", authenticateJWT, isAdmin, async (req, res) => {
	try {
		const users = await UserModel.find().select("-passwordHash");
		res.json(users);
	} catch (err) {
		console.error("Fetch all users error:", err);
		res.status(500).json({ type: UserErrors.SERVER_ERROR, message: "An error occurred while fetching users" });
	}
});

export { router as userRouter };
