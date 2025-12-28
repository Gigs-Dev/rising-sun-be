import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/sendResponse';
import { publicKey } from '../config/env.config';


export const RefreshToken = async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;

  if (!token) {
    return sendResponse(res, 401, false, 'No refresh token');
  }

  try {
    const decoded = jwt.verify(
      token,
      publicKey!
    ) as { id: string };

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      publicKey!,
      { expiresIn: '15m' }
    );

    return sendResponse(res, 200, true, 'Token refreshed', {
      accessToken: newAccessToken
    });
  } catch {
    return sendResponse(res, 401, false, 'Invalid refresh token');
  }
};
