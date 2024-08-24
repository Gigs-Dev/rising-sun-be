import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { handle500Errors } from "./api-response";



interface CustomJwtPayload extends JwtPayload {
    isAdmin?: boolean;
    userId?: string;
  }

declare global {
    namespace Express {
      interface Request {
        user?: CustomJwtPayload;
        userId?:  string;
      }
    }
  }


export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeaders = req.headers.authorization;

        if(!authHeaders){
            return res.status(401).json({ msg: 'You are not authenticated' });
        }

        const token = authHeaders.split(' ')[1];

        jwt.verify(token, 'jwtkey', (err, payload) => {
            if(err || !payload) {
                return res.status(403).json({ msg: 'Token is not valid' });
            }
            req.user = payload as CustomJwtPayload;
            req.userId = (payload as CustomJwtPayload).userId;
            next();
        })
    } catch (error) {
        handle500Errors(error, res);
    }
}



export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if(req.userId === req.params.id || req.user?.isAdmin){
            next()
        } else {
            res.status(403).json('Action not allowed')
        }
    })
}



export const verifyTokenAndAdmin = async (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if(req.user?.isAdmin){
            next();
        } else {
            res.status(403).json('Action not allowed')
        }
    })
}
