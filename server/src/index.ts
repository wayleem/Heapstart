import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import helmet from "helmet";
import { userRouter } from "./routes/user";
import { authRouter } from "./routes/auth";

dotenv.config();
const app = express();

app.use(helmet());

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		optionsSuccessStatus: 200,
	}),
);

app.use(passport.initialize());

app.use("/auth", authRouter);

app.use("/user", userRouter);

mongoose
	.connect(process.env.MONGODB_URL, { dbName: "ecommerce" })
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(3001, () => console.log("SERVER STARTED"));
	})
	.catch((err) => console.error("MongoDB connection error:", err));

/*
curl -X POST http://localhost:3001/user/register \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpassword"}'
 */
