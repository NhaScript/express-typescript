import { Providers } from "@common/enums/providers.enum";
import { Role } from "@common/enums/roles.enum";
import { Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  photoUrl?: string;
  provider: Providers;
  providerId: string;
  email?: string;
  password?: string;
  role: Role;
  lastLogin: Date;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
