import { body, param, query, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { createErrorResponse, CommonErrors } from "../utils/errors";
import logger from "../utils/logger";

export const validate = (validations: ValidationChain[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		await Promise.all(validations.map((validation) => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}

		logger.warn("Validation error", { errors: errors.array() });
		next(createErrorResponse(CommonErrors.VALIDATION_ERROR, "Validation failed", 400, errors.array()));
	};
};

export const validateRegistration = [
	body("email").isEmail().withMessage("Invalid email address"),
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
	validate,
];

export const validateLogin = [
	body("email").isEmail().withMessage("Invalid email address"),
	body("password").notEmpty().withMessage("Password is required"),
	validate,
];

export const validateUserUpdate = [
	body("profile.firstName").optional().trim().notEmpty().withMessage("First name cannot be empty"),
	body("profile.lastName").optional().trim().notEmpty().withMessage("Last name cannot be empty"),
	body("profile.phone").optional().isMobilePhone("any").withMessage("Invalid phone number"),
	validate,
];

export const validateProductCreation = [
	body("name").trim().notEmpty().withMessage("Product name is required"),
	body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
	body("description").optional().trim(),
	body("category").optional().trim(),
	validate,
];

export const validateOrderCreation = [
	body("products").isArray().withMessage("Products must be an array"),
	body("products.*.productId").isMongoId().withMessage("Invalid product ID"),
	body("products.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
	body("shippingAddress").isObject().withMessage("Shipping address is required"),
	body("shippingAddress.street").trim().notEmpty().withMessage("Street is required"),
	body("shippingAddress.city").trim().notEmpty().withMessage("City is required"),
	body("shippingAddress.state").trim().notEmpty().withMessage("State is required"),
	body("shippingAddress.postalCode").trim().notEmpty().withMessage("Postal code is required"),
	body("shippingAddress.country").trim().notEmpty().withMessage("Country is required"),
	validate,
];

export const validatePromoCode = [body("code").trim().notEmpty().withMessage("Promo code is required"), validate];
