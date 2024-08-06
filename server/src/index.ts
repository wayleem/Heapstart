import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/database";
import { userRouter } from "./routes/userRoutes";
import { authRouter } from "./routes/authRoutes";
import { adminRouter } from "./routes/adminRoutes";
import { productRouter } from "./routes/productRoutes";
import { orderRouter } from "./routes/orderRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
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
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

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

/*
curl -X POST http://localhost:3001/user/register \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpassword"}'
 */
