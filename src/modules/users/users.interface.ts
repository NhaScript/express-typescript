import { Providers } from "@common/enums/providers.enum";
import { Role } from "@common/enums/roles.enum";
import { Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  photoUrl?: string;
  provider: Providers;
  providerId: string;
  email?: string; // Top-level email (optional, used for email login)
  password?: string; // Hashed password (optional, used for email login)
  role: Role;
  lastLogin: Date;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
