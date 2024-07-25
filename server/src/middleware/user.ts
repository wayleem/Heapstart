import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { UserErrors } from "../errors";

export const validateUserUpdate = [
	body("profile.firstName").optional().trim().notEmpty().withMessage("First name cannot be empty"),
	body("profile.lastName").optional().trim().notEmpty().withMessage("Last name cannot be empty"),
	body("profile.phone").optional().isMobilePhone("any").withMessage("Invalid phone number"),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array(), type: UserErrors.VALIDATION_ERROR });
		}
		next();
	},
];
