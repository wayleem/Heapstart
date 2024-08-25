import jwt from "jsonwebtoken";

export const generateTokens = (user: { id: string; isAdmin: boolean }) => {
	const accessToken = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "15m" });
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
	return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string): { id: string; isAdmin: boolean } => {
	return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { id: string; isAdmin: boolean };
};

export const verifyToken = (token: string): { id: string; isAdmin: boolean } => {
	return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; isAdmin: boolean };
};
