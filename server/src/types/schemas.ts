import { Schema, Types } from "mongoose";

// Address Schema
export const AddressSchema = new Schema({
	firstName: { type: String, required: true, trim: true },
	lastName: { type: String, required: true, trim: true },
	street: { type: String, required: true, trim: true },
	city: { type: String, required: true, trim: true },
	state: { type: String, required: true, trim: true },
	postalCode: { type: String, required: true, trim: true },
	country: { type: String, required: true, trim: true },
});
