import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

export const loginAdmin = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	try {
		const admin = await Admin.findOne({ username });
		if (!admin || !(await admin.comparePassword(password))) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		const token = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, process.env.JWT_SECRET!, {
			expiresIn: "1h",
		});
		admin.lastLogin = new Date();
		await admin.save();
		res.json({
			token,
			admin: {
				id: admin._id,
				username: admin.username,
				name: admin.name,
				role: admin.role,
			},
		});
	} catch (error) {
		console.error("Admin login error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Add more admin-related controller functions here as needed
