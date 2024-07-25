import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/errors";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err);

	if (err instanceof ErrorResponse) {
		return res.status(400).json({ type: err.type, message: err.message, details: err.details });
	}

	res.status(500).json({ message: "Internal Server Error" });
};
