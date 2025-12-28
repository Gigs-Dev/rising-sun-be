import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";
import mongoose from "mongoose";


export const requireSameUser = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
    const authUserId = req.user?.id; 
    const requestedUserId = req.params.id;


    /* -------------------- VALIDATIONS -------------------- */
    if (!mongoose.Types.ObjectId.isValid(requestedUserId)) {
        return sendResponse(res, 400, false, 'Invalid user ID');
    }

    if (authUserId !== requestedUserId || req.user.isBanned || req.user?.role !== 'isAdmin') {
        return sendResponse(res, 403, false, 'Access denied');
    }

    next();
};
