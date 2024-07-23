import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { UserErrors } from "../errors";

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
