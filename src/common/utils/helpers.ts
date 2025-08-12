import { envConfig } from '@config/env';
import jwt from 'jsonwebtoken';
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

