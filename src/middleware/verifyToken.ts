import { Request, Response, NextFunction } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { privateKey, publicKey } from "../config/env.config";
import { sendResponse } from "../utils/sendResponse";



export function signJwt(object:Object, options?: jwt.SignOptions | undefined){
    return jwt.sign(object, privateKey!, {
        ...(options && options),
        algorithm: 'RS256'
    })
}


export function verifyJwt(token: string){
    try {
        const decoded = jwt.verify(token, publicKey!);

        return {
            valid: true,
            expired: false,
            decoded
        }
    } catch (error: any) {
        return {
            valid: error,
            expired: error.message = 'Jwt expired',
            decoded: null
        }
    }
}



interface AuthPayload extends JwtPayload {
  id: string;
  role?: string;
  tokenVersion?: number;
}

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
      publicKey!
    ) as AuthPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role,
      tokenVersion: decoded.tokenVersion
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
