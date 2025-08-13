import { ForbiddenError, TokenExpiredError, UnauthorizedError } from "@common/core/custom-error";
import { Role } from "@common/enums/roles.enum";
import { AuthRequest } from "@common/interfaces/AuthRequest";
import { verifyAccessToken } from "@common/utils/jwt";
import { profile } from "@modules/auth/auth.service";
import { NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken";



export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new UnauthorizedError("Authorization header is missing or invalid"));
    }
    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token) as JwtPayload;
  
    if (!payload || !payload.sub) {
      throw new TokenExpiredError("Access token is invalid or expired");
    }

    const user = await profile(payload.sub);
    if (!user) {
      throw new UnauthorizedError("User not authenticated or user ID not found");
    }
    req.user = user;
    next();
}

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError("Authentication required."));
    }

    if (req.user.role === Role.SUPER) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return next(new ForbiddenError("You do not have permission to access this resource"));
    }

    next();
  };
}
