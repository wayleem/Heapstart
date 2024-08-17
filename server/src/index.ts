import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/database";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(
	cors({
		origin: [process.env.FRONTEND_URL || "http://localhost:5173", process.env.ADMIN_URL || "http://localhost:5174"],
		optionsSuccessStatus: 200,
		credentials: true,
	}),
);

// Routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err);
		process.exit(1);
	});

// Graceful shutdown
process.on("SIGINT", () => {
	console.log("Gracefully shutting down");
	process.exit(0);
});
