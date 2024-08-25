import { Request, Response, NextFunction } from "express";
import { CommonErrors, ErrorResponse } from "../utils/errors";
import logger from "../utils/logger";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	logger.error("Error occurred", { error: err, url: req.url, method: req.method });

	if (err instanceof ErrorResponse) {
		return res.status(err.statusCode).json({
			type: err.type,
			message: err.message,
			details: err.details,
		});
	}

	res.status(500).json({
		type: CommonErrors.SERVER_ERROR,
		message: "An unexpected error occurred",
		details: process.env.NODE_ENV === "production" ? {} : err,
	});
};
