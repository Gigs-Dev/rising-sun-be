import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: {
  id: string;
  role?: string;
  tokenVersion?: number;
}) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m'
  });
};

export const generateRefreshToken = (payload: {
  id: string;
  tokenVersion?: number;
}) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d'
  });
};
