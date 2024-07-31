import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
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

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
		const admin = await Admin.findById(decoded.id);

		if (!admin) {
			return res.status(401).json({ message: "Invalid token" });
		}

		(req as any).admin = admin;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
};
