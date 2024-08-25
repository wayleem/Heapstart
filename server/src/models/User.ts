import { Schema, model, Document, Model, Types } from "mongoose";
import bcrypt from "bcrypt";
import { AddressSchema, IAddress } from "./Address";

export interface IUser extends Document {
	email: string;
	passwordHash: string;
	lastLogin?: Date;
	address: IAddress;
	cart: Array<{
		productId: Types.ObjectId;
		quantity: number;
	}>;
	tokens: Tokens;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
	{
		email: { type: String, required: true, unique: true, trim: true },
		passwordHash: { type: String, required: true },
		lastLogin: { type: Date },
		address: AddressSchema,
		cart: [
			{
				productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
				quantity: { type: Number, required: true, min: 1 },
			},
		],

		tokens: {
			resetPasswordToken: { type: String },
			resetPasswordExpires: { type: Date },
			verificationToken: { type: String },
		},
	},
	{ timestamps: true },
);

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.passwordHash);
};

UserSchema.pre("save", async function (next) {
	if (this.isModified("passwordHash")) {
		this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
	}
	next();
});

UserSchema.index({ email: 1 });

const User: Model<IUser> = model<IUser>("User", UserSchema);
export default User;
