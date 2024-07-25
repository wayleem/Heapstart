import { Schema, model, Model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IAdmin extends Document {
	username: string;
	password: string;
	name: string;
	role: "super" | "manager" | "support";
	lastLogin?: Date;
	isActive: boolean;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	role: { type: String, enum: ["super", "manager", "support"], required: true },
	lastLogin: { type: Date },
	isActive: { type: Boolean, default: true },
});

AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

AdminSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

const Admin: Model<IAdmin> = model<IAdmin>("Admin", AdminSchema);

export default Admin;
