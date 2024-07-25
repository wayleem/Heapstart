import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { UserErrors } from "../errors";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		return res.status(401).json({ type: UserErrors.UNAUTHORIZED, message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; isAdmin: boolean };
		if (!decoded.isAdmin) {
			return res.status(403).json({ type: UserErrors.UNAUTHORIZED, message: "Not authorized as admin" });
		}
		(req as any).userId = decoded.id;
		next();
	} catch (error) {
		res.status(401).json({ type: UserErrors.UNAUTHORIZED, message: "Invalid token" });
	}
};
