import { envConfig } from '@config/env';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
export const generateAccessToken = (userId: string): string => {
   const accessToken: string =  jwt.sign(
    { sub: userId },
    envConfig.jwt.accessTokenSecret,
    {
      algorithm: 'HS256',
      expiresIn: envConfig.jwt.accessTokenExpiration,
    }
  );
  return accessToken;
};

export const verifyAccessToken = (token: string): jwt.JwtPayload | null => {
  try {
    return jwt.verify(token, envConfig.jwt.accessTokenSecret) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};

export const generateRefreshToken = (userId: string, tokenId: string): string => {
  const refreshToken = jwt.sign(
    { sub: userId, jti: tokenId },
    envConfig.jwt.refreshTokenSecret,
    {
      algorithm: 'HS256',
      expiresIn: envConfig.jwt.refreshTokenExpiration,
    }
  );
  return refreshToken;
};

export function verifyRefreshToken(token: string): jwt.JwtPayload | null {
  try {
    return jwt.verify(token, envConfig.jwt.refreshTokenSecret) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
}

export async function generateTokenId(): Promise<string> {
  const tokenId = crypto.randomBytes(40).toString('hex');
  return tokenId;
}




