// controllers/adminController.ts

import { Request, Response } from "express";

export const getAdminProfile = async (req: Request, res: Response) => {
	const admin = (req as any).admin;
	res.json({
		id: admin._id,
		username: admin.username,
		lastLogin: admin.lastLogin,
	});
};
