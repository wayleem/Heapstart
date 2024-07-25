import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import UserModel from "../models/user";
import { UserErrors } from "../errors";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ type: UserErrors.UNAUTHORIZED, message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
		(req as any).userId = decoded.id;
		next();
	} catch (error) {
		return res.status(401).json({ type: UserErrors.UNAUTHORIZED, message: "Invalid token" });
	}
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserModel.findById((req as any).userId);
		if (!user || !user.isAdmin) {
			return res.status(403).json({ type: UserErrors.UNAUTHORIZED, message: "Not authorized as admin" });
		}
		next();
	} catch (error) {
		return res.status(500).json({ type: UserErrors.SERVER_ERROR, message: "Server error" });
	}
};

export const validateRegistration = [
	body("email").trim().isEmail().normalizeEmail().withMessage("Invalid email address"),
	body("password")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long")
		.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
		.withMessage(
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		),
	body("profile.firstName").trim().notEmpty().withMessage("First name is required"),
	body("profile.lastName").trim().notEmpty().withMessage("Last name is required"),
	body("profile.phone").optional().isMobilePhone("any").withMessage("Invalid phone number"),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array(), type: UserErrors.VALIDATION_ERROR });
		}
		next();
	},
];

export const validateLogin = [
	body("email").trim().isEmail().normalizeEmail().withMessage("Invalid email address"),
	body("password").notEmpty().withMessage("Password is required"),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array(), type: UserErrors.VALIDATION_ERROR });
		}
		next();
	},
];
