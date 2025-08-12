import { Request, Response } from "express";
import { CookieInput, SigninWithTelegramInput, SignupWithEmailInput } from "./auth.schema";
import { rotateRefreshToken, signinWithEmail, signinWithTelegram, signupWithEmail } from "./auth.service";
import { StatusCode } from "@common/enums/status-code.enum";
import { SigninResult } from "./auth.interface";
import { BadRequestError, UnauthorizedError } from "@common/core/custom-error";
import { isValidTelegramAuthDate, validateTelegramAuth } from "@common/utils/telegram";
import { Environment } from "@common/enums/enviroment.enum";
import { envConfig } from "@config/env";

export const signupWithEmailHandler = async (
  req: Request<{}, {}, SignupWithEmailInput>,
  res: Response
) => {
  const user = await signupWithEmail(req.body);
  if (!user) {
    return res.status(StatusCode.BAD_REQUEST).json({
      message: "User creation failed",
    });
  }
  res.status(StatusCode.CREATED).json({
    message: "User created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      provider: user.provider,
    },
  });
};

export const signinWithEmailHandler = async (req: Request<{},{},SignupWithEmailInput>, res: Response) => {
  const {email, password} = req.body
  const result: SigninResult | null = await signinWithEmail(email, password);
  if (!result?.user) {
    return res.status(StatusCode.UNAUTHORIZED).json({
      message: "Invalid email or password",
    });
  }
  res.status(StatusCode.OK).json({
    message: "User signed in successfully",
    result: {
        user: {
          id: result.user._id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role,
          provider: result.user.provider,
        },
        accessToken: result.accessToken,

    }
  });
}

export const signinWithTelegramHandler = async (req: Request<{}, {}, SigninWithTelegramInput>, res: Response) => {
  const userData = req.body;

   // Check if auth_date is valid
  if (!userData.auth_date || !userData.hash) {
    throw new BadRequestError("Missing Telegram auth data");
  }

  if(!isValidTelegramAuthDate(Number(userData.auth_date))){
      throw new BadRequestError("Authentication data expired")
  }
  if (!validateTelegramAuth(userData)) {
    throw new UnauthorizedError("Invalid telegram auth")
  }

  const result: SigninResult | null = await signinWithTelegram(userData)

  res.cookie("refreshToken", result?.refreshToken, {
    httpOnly: true,
    secure: envConfig.environment === Environment.PRODUCTION,
    sameSite: envConfig.cookie.sameSite,
    maxAge: envConfig.cookie.maxAge,
  });
  res.status(StatusCode.OK).json({
    message: "Signin with telegram  successful",
    result: { user: result?.user, accessToken: result?.accessToken },
  });
};

export const rotateRefreshTokenHandler = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(StatusCode.UNAUTHORIZED).json({ message: "Refresh token not found" });
  }

  const result = await rotateRefreshToken(refreshToken);
  if (!result) {
    return res.status(StatusCode.UNAUTHORIZED).json({ message: "Failed to rotate refresh token" });
  }

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: envConfig.environment === Environment.PRODUCTION,
    sameSite: envConfig.cookie.sameSite,
    maxAge: envConfig.cookie.maxAge,
  });
  res.status(StatusCode.OK).json({
    message: "Refresh token rotated successfully",
    result: { accessToken: result.accessToken },
  });
};
