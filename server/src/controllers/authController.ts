import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Admin from "../models/Admin";
import { sendResetPasswordEmail } from "../services/emailService";
import { createErrorResponse, UserErrors, CommonErrors } from "../utils/errors";
import logger from "../utils/logger";
import { generateTokens, verifyRefreshToken } from "../utils/jwUtils";

export const authController = {
	register: async (req: Request, res: Response, next: NextFunction) => {
		const { email, password, profile } = req.body;
		try {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				logger.warn("Registration attempt with existing email", { email });
				return next(createErrorResponse(UserErrors.EMAIL_ALREADY_EXISTS, "Email already exists", 400));
			}
			const newUser = new User({ email, password, profile });
			await newUser.save();
			const { accessToken, refreshToken } = generateTokens({ id: newUser._id.toString(), isAdmin: false });
			logger.info("User registered successfully", { userId: newUser._id });
			res.status(201).json({
				message: "User Registered Successfully",
				accessToken,
				refreshToken,
				userId: newUser._id,
			});
		} catch (err) {
			logger.error("Registration error", { error: err });
			next(
				createErrorResponse(
					UserErrors.REGISTRATION_ERROR,
					"An error occurred during registration",
					500,
					err instanceof Error ? err.message : String(err),
				),
			);
		}
	},

	login: async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;
		try {
			const user = await User.findOne({ email });
			if (!user || !(await user.comparePassword(password))) {
				logger.warn("Login attempt with invalid credentials", { email });
				return next(createErrorResponse(UserErrors.WRONG_CREDENTIALS, "Invalid email or password", 400));
			}
			const { accessToken, refreshToken } = generateTokens({ id: user._id.toString(), isAdmin: false });
			user.lastLogin = new Date();
			await user.save();
			logger.info("User logged in successfully", { userId: user._id });
			res.json({ accessToken, refreshToken, userId: user._id, email: user.email });
		} catch (err) {
			logger.error("Login error", { error: err });
			next(
				createErrorResponse(
					UserErrors.LOGIN_ERROR,
					"An error occurred during login",
					500,
					err instanceof Error ? err.message : String(err),
				),
			);
		}
	},

	refreshToken: async (req: Request, res: Response, next: NextFunction) => {
		const { refreshToken } = req.body;
		if (!refreshToken) {
			return next(createErrorResponse(CommonErrors.BAD_REQUEST, "Refresh token is required", 400));
		}
		try {
			const decoded = verifyRefreshToken(refreshToken);
			const { accessToken, refreshToken: newRefreshToken } = generateTokens({
				id: decoded.id,
				isAdmin: decoded.isAdmin,
			});
			logger.info("Tokens refreshed successfully", { userId: decoded.id });
			res.json({ accessToken, refreshToken: newRefreshToken });
		} catch (error) {
			logger.error("Token refresh error", { error });
			next(createErrorResponse(UserErrors.REFRESH_TOKEN_INVALID, "Invalid refresh token", 403));
		}
	},

	forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
		const { email } = req.body;
		try {
			const user = await User.findOne({ email });
			if (!user) {
				logger.info("Password reset requested for non-existent email", { email });
				return res.json({ message: "If a user with that email exists, a password reset link has been sent." });
			}
			const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
			user.tokens.resetPasswordToken = resetToken;
			user.tokens.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
			await user.save();
			await sendResetPasswordEmail(user.email, resetToken);
			logger.info("Password reset email sent", { userId: user._id });
			res.json({ message: "If a user with that email exists, a password reset link has been sent." });
		} catch (error) {
			logger.error("Password reset error", { error });
			next(
				createErrorResponse(
					UserErrors.PASSWORD_RESET_ERROR,
					"An error occurred during password reset",
					500,
					error instanceof Error ? error.message : String(error),
				),
			);
		}
	},

	resetPassword: async (req: Request, res: Response, next: NextFunction) => {
		const { token } = req.params;
		const { password } = req.body;
		try {
			const user = await User.findOne({
				"tokens.resetPasswordToken": token,
				"tokens.resetPasswordExpires": { $gt: Date.now() },
			});
			if (!user) {
				logger.warn("Invalid or expired password reset token used", { token });
				return next(
					createErrorResponse(
						UserErrors.PASSWORD_RESET_ERROR,
						"Password reset token is invalid or has expired",
						400,
					),
				);
			}
			user.passwordHash = password;
			user.tokens.resetPasswordToken = undefined;
			user.tokens.resetPasswordExpires = undefined;
			await user.save();
			logger.info("Password reset successfully", { userId: user._id });
			res.json({ message: "Password has been reset successfully" });
		} catch (error) {
			logger.error("Password reset error", { error });
			next(
				createErrorResponse(
					UserErrors.PASSWORD_RESET_ERROR,
					"An error occurred during password reset",
					500,
					error instanceof Error ? error.message : String(error),
				),
			);
		}
	},

	loginAdmin: async (req: Request, res: Response, next: NextFunction) => {
		const { username, password } = req.body;
		try {
			const admin = await Admin.findOne({ username });
			if (!admin || !(await admin.comparePassword(password))) {
				logger.warn("Admin login attempt with invalid credentials", { username });
				return next(createErrorResponse(UserErrors.WRONG_CREDENTIALS, "Invalid credentials", 401));
			}
			const { accessToken, refreshToken } = generateTokens({ id: admin._id.toString(), isAdmin: true });
			admin.lastLogin = new Date();
			await admin.save();
			logger.info("Admin logged in successfully", { adminId: admin._id });
			res.json({ accessToken, refreshToken, admin: { id: admin._id, username: admin.username } });
		} catch (error) {
			logger.error("Admin login error", { error });
			next(
				createErrorResponse(
					UserErrors.LOGIN_ERROR,
					"An error occurred during admin login",
					500,
					error instanceof Error ? error.message : String(error),
				),
			);
		}
	},

	logout: async (req: Request, res: Response) => {
		// In a stateless JWT system, we don't need to do anything server-side for logout
		// The client should discard the tokens
		logger.info("User logged out", { userId: req.userId });
		res.json({ message: "Logged out successfully" });
	},
};
