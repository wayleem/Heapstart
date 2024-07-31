import jwt from "jsonwebtoken";

export const generateToken = (user: { id: string; isAdmin: boolean }): string => {
	return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

export const verifyToken = (token: string): { id: string; isAdmin: boolean } => {
	return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
};
