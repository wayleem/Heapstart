import { Schema, model } from "mongoose";

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
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
      country: { type: String, required: true, trim: true }
    }
  },
  orderHistory: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  lastLogin: { type: Date },
  tokens: {
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verificationToken: { type: String }
  }
}, {
  timestamps: true
});

UserSchema.index({ email: 1, username: 1 });

export const UserModel = model<IUser>("User", UserSchema, "users");
