import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";
import mongoose from "mongoose";


export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authUserId = req.user?.id;
  const requestedUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(requestedUserId)) {
        return sendResponse(res, 400, false, 'Invalid user ID');
    }

    if (!req.user) {
        return sendResponse(res, 401, false, 'Authentication required');
    }

    const isOwner = authUserId === requestedUserId;
    const isAdmin = req.user?.role === 'isAdmin';

    if (req.user.isBanned) {
        return sendResponse(res, 403, false, 'User is banned');
    }

    if (!isOwner && !isAdmin) {
        return sendResponse(res, 403, false, 'Access denied');
    }

  next();
};


export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authAdminId = req.user?.id;
    const requestedUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(requestedUserId)) {
        return sendResponse(res, 400, false, 'Invalid user ID');
    }

    if (!req.user) {
        return sendResponse(res, 401, false, 'Authentication required');
    }

    const isOwner = authAdminId === requestedUserId;
    const isAdmin = req.user?.role === 'isAdmin';

    if (!isOwner && !isAdmin) {
        return sendResponse(res, 403, false, 'Access denied');
    }

    next();
}

