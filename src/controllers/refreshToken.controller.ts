import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { sendResponse } from '../utils/sendResponse';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { NODE_ENV, publicKey } from '../config/env.config';

interface RefreshPayload {
  id: string;
  tokenVersion: number;
}

export const RefreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return sendResponse(res, 401, false, 'Refresh token missing');
    }

    const decoded = jwt.verify(
      token,
      publicKey!
    ) as RefreshPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
      return sendResponse(res, 401, false, 'Invalid refresh token');
    }

    // Token invalidation (password change, logout all, etc.)
    if (user.tokenVersion !== decoded.tokenVersion) {
      return sendResponse(res, 401, false, 'Session expired');
    }

    const newAccessToken = generateAccessToken({
      user: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion
    });

    const newRefreshToken = generateRefreshToken({
      user: user._id.toString(),
      tokenVersion: user.tokenVersion
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refreshToken',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendResponse(res, 200, true, 'Token refreshed', {
      accessToken: newAccessToken
    });
  } catch (err) {
    return sendResponse(res, 401, false, 'Invalid or expired refresh token');
  }
};
