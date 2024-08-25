import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CommonErrors, createErrorResponse, UserErrors } from "../utils/errors";
import logger from "../utils/logger";
import { verifyToken } from "../utils/jwUtils";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) {
		logger.warn("Authentication failed: No token provided");
		return next(createErrorResponse(CommonErrors.UNAUTHORIZED, "No token provided", 401));
	}
	try {
		const decoded = verifyToken(token);
		req.userId = decoded.id;
		next();
	} catch (error) {
		logger.warn("Authentication failed: Invalid token", { error });
		next(createErrorResponse(CommonErrors.UNAUTHORIZED, "Invalid token", 401));
	}
};

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
	const adminToken = req.header("Admin-Token");
	const authHeader = req.header("Authorization");

	if (adminToken && adminToken === process.env.ADMIN_TOKEN) {
		return next();
	}

	if (authHeader) {
		const token = authHeader.split(" ")[1];
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
			if (decoded.isAdmin) {
				return next();
			}
		} catch (error) {
			// Token verification failed
		}
	}

	return res.status(401).json({ message: "Unauthorized: Invalid admin authentication" });
};
