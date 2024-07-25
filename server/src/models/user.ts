import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema<IUser, UserModel>(
	{
		email: { type: String, required: true, unique: true, trim: true, lowercase: true },
		passwordHash: { type: String, required: true },
		isAdmin: { type: Boolean, default: false },
		createdAt: { type: Date, default: Date.now, immutable: true },
		updatedAt: { type: Date, default: Date.now },
		isActive: { type: Boolean, default: true },
		profile: {
			firstName: { type: String, required: true, trim: true },
			middleName: { type: String, trim: true },
			lastName: { type: String, required: true, trim: true },
			phone: { type: String, trim: true },
			address: {
				street: { type: String, required: true, trim: true },
				city: { type: String, required: true, trim: true },
				state: { type: String, required: true, trim: true },
				postalCode: { type: String, required: true, trim: true },
				country: { type: String, required: true, trim: true },
			},
		},
		orderHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
		lastLogin: { type: Date },
		tokens: {
			resetPasswordToken: { type: String },
			resetPasswordExpires: { type: Date },
			verificationToken: { type: String },
		},
	},
	{
		timestamps: true,
	},
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

const UserModel = model<IUser, UserModel>("User", UserSchema);

export default UserModel;
