import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	try {
		const mongoURI = process.env.MONGODB_URL;
		if (!mongoURI) {
			throw new Error("MongoDB connection string is not defined in environment variables.");
		}

		await mongoose.connect(mongoURI, { dbName: "ecommerce" });
		console.log("Connected to MongoDB");
	} catch (err) {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	}
};

export default connectDB;
