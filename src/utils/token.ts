import jwt from 'jsonwebtoken';
import { accessTokenTtl, privateKey, publicKey, refreshTokenTtl } from "../config/env.config";

export const generateAccessToken = (payload: {
  user: string;
  role?: string;
  tokenVersion?: number;
}) => {
  return jwt.sign(payload, publicKey!, {
    expiresIn: Number(accessTokenTtl)
  });
};

export const generateRefreshToken = (payload: {
  user: string;
  tokenVersion?: number;
}) => {
  return jwt.sign(payload, publicKey!, {
    expiresIn: Number(refreshTokenTtl)
  });
};
