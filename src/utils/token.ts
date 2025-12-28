import jwt from 'jsonwebtoken';
import { accessTokenTtl, refreshTokenTtl } from "../config/env.config";

export const generateAccessToken = (payload: {
  id: string;
  role?: string;
  tokenVersion?: number;
}) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: Number(accessTokenTtl)
  });
};

export const generateRefreshToken = (payload: {
  id: string;
  tokenVersion?: number;
}) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: Number(refreshTokenTtl)
  });
};
