import { IUser } from "@modules/users/users.interface";
import { Request } from "express";

// Add generics: Params, ResBody, ReqBody, ReqQuery
export interface AuthRequest<
  Params = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = {}
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: IUser;
}
