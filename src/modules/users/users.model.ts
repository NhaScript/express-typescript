// models/AuthProvider.ts
import { Schema, model } from "mongoose";
import { IUser } from "./users.interface";
import { Role } from "@common/enums/roles.enum";
import { Providers } from "@common/enums/providers.enum";

const userSchema = new Schema<IUser>(
    {
    username: { type: String, required: true, trim: true },
    photoUrl: { type: String, trim: true },
    role: { type: String, enum: Object.values(Role), required: true },
    provider: {
      type: String,
      enum: Object.values(Providers),
      required: true,
    },
    providerId: { type: String, unique: true, required: true }, 
    email: { type: String, lowercase: true, unique: true, sparse: true },
    password: { type: String, select: false },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    status: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true, versionKey: false }
);
const User = model<IUser>("User", userSchema);
export default User;
