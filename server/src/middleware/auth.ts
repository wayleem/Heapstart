import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserErrors } from "../utils/errors";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ type: UserErrors.UNAUTHORIZED, message: "No token provided" });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
		req.userId = decoded.id;
		next();
	} catch (error) {
		return res.status(401).json({ type: UserErrors.UNAUTHORIZED, message: "Invalid token" });
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
