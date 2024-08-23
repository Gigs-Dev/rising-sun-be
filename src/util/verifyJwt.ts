import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { handle500Errors } from "./api-response";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeaders = req.headers.authorization;

        if(!authHeaders){
            res.status(401).json({ msg: 'You are not authenticated' });
            return;
        }

        const token = authHeaders.split(' ')[1];

        jwt.verify(token, 'jwtkey', (err, payload) => {
            if(err){
                res.status(403).json({ msg: 'Token not valid or expired' });
                return;
            } else {
                req.user = payload;
                next()
            }
        })
            
    } catch (error) {
        handle500Errors(error, res);
    }
}


export const verifyTokenAndAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        
    }
}
