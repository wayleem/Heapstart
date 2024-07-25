import express from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import UserModel from "../models/user";
import { UserErrors } from "../errors";

const router = express.Router();

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await UserModel.findOne({ email, isAdmin: true });
		if (!user) {
			return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
		if (!isPasswordValid) {
			return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
		}

		const token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1h" });

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			token,
			userId: user._id,
			email: user.email,
			message: "Admin Logged In Successfully",
		});
	} catch (err) {
		console.error("Admin login error:", err);
		res.status(500).json({ type: UserErrors.LOGIN_ERROR, message: "An error occurred during admin login" });
	}
});

export { router as adminRouter };
