// scripts/createAdminUser.ts

import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "../models/Admin";
import bcrypt from "bcrypt";

dotenv.config();

const createAdminUser = async () => {
	try {
		const mongoURI = process.env.MONGODB_URL;
		const dbName = process.env.DB_NAME || "ecommerce"; // Add this line

		if (!mongoURI) {
			console.error("MongoDB connection string is not defined in environment variables.");
			process.exit(1);
		}

		await mongoose.connect(mongoURI, { dbName }); // Specify the database name here

		const adminUsername = process.env.ADMIN_USERNAME;
		const adminPassword = process.env.ADMIN_PASSWORD;

		if (!adminUsername || !adminPassword) {
			console.error("Admin username and password must be set in environment variables.");
			process.exit(1);
		}

		const existingAdmin = await Admin.findOne({ username: adminUsername });

		if (existingAdmin) {
			console.log("Admin user already exists. Updating password...");
			existingAdmin.password = await bcrypt.hash(adminPassword, 10);
			await existingAdmin.save();
		} else {
			console.log("Creating new admin user...");
			const newAdmin = new Admin({
				username: adminUsername,
				password: adminPassword, // The model's pre-save hook will hash this
			});
			await newAdmin.save();
		}

		console.log("Admin user created/updated successfully.");
	} catch (error) {
		console.error("Error creating/updating admin user:", error);
	} finally {
		await mongoose.disconnect();
	}
};

createAdminUser();
