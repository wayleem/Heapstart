import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { sendResetPasswordEmail } from "../services/emailService";
import { UserErrors } from "../utils/errors";

export const register = async (req: Request, res: Response) => {
	const { email, password, profile } = req.body;
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ type: UserErrors.EMAIL_ALREADY_EXISTS });
		}
		const newUser = new User({ email, passwordHash: password, profile });
		await newUser.save();
		const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
		res.status(201).json({ message: "User Registered Successfully", token, userId: newUser._id });
	} catch (err) {
		console.error("Registration error:", err);
		res.status(500).json({ type: UserErrors.REGISTRATION_ERROR, message: "An error occurred during registration" });
	}
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user || !(await user.comparePassword(password))) {
			return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
		}
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
		user.lastLogin = new Date();
		await user.save();
		res.status(200).json({ token, userId: user._id, email: user.email, message: "User Logged In Successfully" });
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ type: UserErrors.LOGIN_ERROR, message: "An error occurred during login" });
	}
};

export const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.json({ message: "If a user with that email exists, a password reset link has been sent." });
		}
		const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
		user.tokens.resetPasswordToken = resetToken;
		user.tokens.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
		await user.save();
		await sendResetPasswordEmail(user.email, resetToken);
		res.json({ message: "If a user with that email exists, a password reset link has been sent." });
	} catch (error) {
		console.error("Password reset error:", error);
		res.status(500).json({ message: "An error occurred" });
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	const { token } = req.params;
	const { password } = req.body;
	try {
		const user = await User.findOne({
			"tokens.resetPasswordToken": token,
			"tokens.resetPasswordExpires": { $gt: Date.now() },
		});
		if (!user) {
			return res.status(400).json({ message: "Password reset token is invalid or has expired" });
		}
		user.passwordHash = password;
		user.tokens.resetPasswordToken = undefined;
		user.tokens.resetPasswordExpires = undefined;
		await user.save();
		res.json({ message: "Password has been reset successfully" });
	} catch (error) {
		console.error("Password reset error:", error);
		res.status(500).json({ message: "An error occurred" });
	}
};
