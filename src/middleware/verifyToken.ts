import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { privateKey, publicKey } from "../config/env.config";
import { sendResponse } from "../utils/sendResponse";



export const verifyUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, 401, false, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      privateKey!
    ) as JwtPayload;

    req.user = {
        id: decoded.id,
        role: decoded.role,
        isBanned: decoded.isBanned
    };

    next();
  } catch (err) {
    return sendResponse(res, 405, false, 'Invalid or expired token');
  }
};



export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        
    }
}
