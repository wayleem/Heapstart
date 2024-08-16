// src/utils/errorUtils.ts

import { AxiosError } from "axios";

/**
 * Handles API errors and returns a standardized error message
 * @param err - The error object
 * @returns A string containing the error message
 */
export const handleApiError = (err: unknown): string => {
	if (err instanceof AxiosError && err.response) {
		return err.response.data.message || err.message;
	}
	return err instanceof Error ? err.message : "An unknown error occurred";
};

/**
 * Abstract logging function that can be easily modified to use different logging services
 * @param level - The log level (e.g., 'info', 'warn', 'error')
 * @param message - The message to log
 * @param meta - Optional metadata to include with the log
 */
export const log = (level: "info" | "warn" | "error", message: string, meta?: any) => {
	// In development, we'll just use console logging
	if (process.env.NODE_ENV === "development") {
		switch (level) {
			case "info":
				console.info(message, meta);
				break;
			case "warn":
				console.warn(message, meta);
				break;
			case "error":
				console.error(message, meta);
				break;
		}
	} else {
		// Use more robust logging in production
		// For example, sending logs to a service like Sentry, LogRocket, or backend
		// Example:
		// LoggingService.log(level, message, meta);
	}
};
