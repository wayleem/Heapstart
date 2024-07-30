import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
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

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById((req as any).userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ type: UserErrors.UNAUTHORIZED, message: "Not authorized as admin" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ type: UserErrors.SERVER_ERROR, message: "Server error" });
  }
};
