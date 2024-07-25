import express from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { UserModel } from "../models/user";
import { UserErrors } from "../errors";
import { validateRegistration, validateLogin } from "../middleware/user";

const router = express.Router();

router.post("/register", validateRegistration, async (req, res) => {
	const { email, password, profile } = req.body;
	try {
		const existingUser = await UserModel.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				type: UserErrors.EMAIL_ALREADY_EXISTS,
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new UserModel({
			email,
			passwordHash: hashedPassword,
			profile,
		});

		await newUser.save();

		const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

		res.status(201).json({
			message: "User Registered Successfully",
			token,
			userId: newUser._id,
		});
	} catch (err) {
		console.error("Registration error:", err);
		res.status(500).json({ type: UserErrors.REGISTRATION_ERROR, message: "An error occurred during registration" });
	}
});

router.post("/login", validateLogin, async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await UserModel.findOne({ email });
		if (!user) {
			return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
		if (!isPasswordValid) {
			return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

		// Update last login
		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			token, // Ensure this field is present
			userId: user._id,
			email: user.email,
			profile: user.profile || null, // Include profile if needed
			message: "User Logged In Successfully",
		});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ type: UserErrors.LOGIN_ERROR, message: "An error occurred during login" });
	}
});

export { router as userRouter };
