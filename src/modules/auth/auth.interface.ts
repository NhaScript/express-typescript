import { IUser } from "@modules/users/users.interface";

export interface SigninResult {
  user: IUser;          // user data without password
  accessToken: string;  // JWT access token
  refreshToken: string; // JWT refresh token
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}
