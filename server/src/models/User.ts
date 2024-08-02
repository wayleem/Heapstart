import { Schema, model, Model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
	email: string;
	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;
	profile: Profile;
	orderHistory: Types.ObjectId[];
	lastLogin?: Date;
	tokens: Tokens;
	cart: {
		[productId: string]: number;
	};
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
	{
		email: { type: String, required: true, unique: true, trim: true, lowercase: true },
		passwordHash: { type: String, required: true },
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
		cart: {
			type: Map,
			of: Number,
			default: {},
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
