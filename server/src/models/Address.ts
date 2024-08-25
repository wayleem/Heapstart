import { Schema, model, Document, Model } from "mongoose";

export interface IAddress extends Document {
	firstName: string;
	lastName: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

export const AddressSchema = new Schema<IAddress>({
	firstName: { type: String, required: true, trim: true },
	lastName: { type: String, required: true, trim: true },
	street: { type: String, required: true, trim: true },
	city: { type: String, required: true, trim: true },
	state: { type: String, required: true, trim: true },
	postalCode: { type: String, required: true, trim: true },
	country: { type: String, required: true, trim: true },
});

const Address: Model<IAddress> = model<IAddress>("Address", AddressSchema);
export default Address;
