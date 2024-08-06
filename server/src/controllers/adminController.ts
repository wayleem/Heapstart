// controllers/adminController.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

export const loginAdmin = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	try {
		const admin = await Admin.findOne({ username });
		if (!admin) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, admin.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET!, { expiresIn: "1h" });

		res.json({ token, admin: { id: admin._id, username: admin.username } });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const getAdminProfile = async (req: Request, res: Response) => {
	const admin = (req as any).admin;
	res.json({
		id: admin._id,
		username: admin.username,
		lastLogin: admin.lastLogin,
	});
};
