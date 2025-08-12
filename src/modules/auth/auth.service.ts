import { SigninWithTelegramInput, SignupWithEmailInput } from "@modules/auth/auth.schema";
import { comparePassword, hashPassword } from "@common/utils/bcrypt";
import { BadRequestError, BadTokenError, ForbiddenError } from "@common/core/custom-error";
import { v4 as uuidv4 } from "uuid";
import { Providers } from "@common/enums/providers.enum";
import User from "@modules/users/users.model";
import { IUser } from "@modules/users/users.interface";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenId,
  verifyRefreshToken,
} from "@common/utils/jwt";
import { RefreshTokenPayload, SigninResult } from "./auth.interface";
import { Role } from "@common/enums/roles.enum";
import { redisClient } from "@common/core/redis";
import { envConfig } from "@config/env";

export const signupWithEmail = async (
  data: SignupWithEmailInput
): Promise<IUser> => {
  const hashedPassword = await hashPassword(data.password);
  if (!hashedPassword) {
    throw new BadRequestError("User creation failed");
  }

  const user = new User({
    username: data.username,
    provider: Providers.EMAIL,
    email: data.email,
    providerId: uuidv4(),
    password: hashedPassword,
    role: data.role,
  });
  await user.save();
  return user;
};

export const signinWithEmail = async (email: string, password: string): Promise<SigninResult | null> => {
  /**
   * * * Check if the user exists in the database
   */
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new BadRequestError("Invalid credentials");
  }

  if (!user.status) {
    throw new ForbiddenError(
      "Your account has been disabled. Please contact support."
    );
  }

  /**
   * * The password is stored in the providerData field, so we need to access it
   */
  const userPassword = user?.password;
  if (!userPassword) {
    throw new BadRequestError("Invalid credentials");
  }

  /**
   * * Compare the provided password with the stored hashed password
   */
  const isMatch = await comparePassword(password, userPassword);
  if (!isMatch) {
    throw new BadRequestError("Password does not match!");
  }

  /**
   * * update last login
   */
  user.lastLogin = new Date();
  await user.save();

  /**
   * * Generate JWT tokens for the user
   * * The access token is used to authenticate the user for protected routes
   * * The refresh token is used to refresh the access token when it expires
   * * The user ID is converted to a string to ensure it is in the correct format for the token
   */
  const tokenId: string = await generateTokenId();
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString(), tokenId);
  return {
    user,
    accessToken,
    refreshToken,
  };
};


export const signinWithTelegram = async (data: SigninWithTelegramInput): Promise<SigninResult | null> => {
  const { id: providerId, username, photo_url, first_name, last_name } = data;

  let user = await User.findOne({ provider: Providers.TELEGRAM, providerId });

  if (!user) {
    const safeUsername =
      username || `${first_name}${last_name ? '_' + last_name : ''}` || `user_${providerId}`;

    user = new User({
      username: safeUsername,
      photo_url,
      provider: Providers.TELEGRAM,
      providerId,
      role: Role.USER
    });

    await user.save();
  }

  if (!user.status) {
    throw new ForbiddenError("Your account has been disabled. Please contact support.");
  }

  user.lastLogin = new Date();
  await user.save();

   const tokenId: string = await generateTokenId();
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString(), tokenId);

  await redisClient.set(`refresh_token:${tokenId}`, refreshToken);
  await redisClient.expire(`refresh_token:${tokenId}`, envConfig.jwt.refreshTokenExpiration);

  return {
    user,
    accessToken,
    refreshToken
  };
};

export const rotateRefreshToken = async (oldRefreshToken: string) => {
    const payload = verifyRefreshToken(oldRefreshToken) as RefreshTokenPayload | null;
    if (!payload) {
        throw new BadRequestError("Invalid refresh token");
    }
    
    const userId: string = payload.sub;
    const tokenId: string = payload.jti;

    const redisKey = `refresh_token:${tokenId}`;

    // 2. Check if refresh token exists in Redis
    const storedToken = await redisClient.get(redisKey);
    if (!storedToken || storedToken !== oldRefreshToken) {
      throw new BadTokenError('Refresh token invalid or revoked');
    }

    
    // Generate new tokens
    const newTokenId: string = await generateTokenId();
    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId, newTokenId);
    
    // Store the new refresh token in Redis
    await redisClient.set(`refresh_token:${newTokenId}`, newRefreshToken);
    await redisClient.expire(`refresh_token:${newTokenId}`, envConfig.jwt.refreshTokenExpiration);
    
    // Delete the old refresh token from Redis
    await redisClient.del(`refresh_token:${tokenId}`);
    
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
}
