import { Request, Response, NextFunction } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { privateKey, publicKey } from "../config/env.config";



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

export const verifyUserToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        
    }
}


export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        
    }
}
