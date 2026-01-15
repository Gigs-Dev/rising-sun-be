import { Request, Response } from "express";
import User from "../../models/user.model";
import { sendResponse } from "../../utils/sendResponse";


export const getAllUsers = async (req:Request, res: Response) => {
    
    const users = await User.find().sort({createdAt: -1});

    if(!users || users.length === 0){
        sendResponse(res, 404, false, 'Users not found')
    }
    
    sendResponse(res, 200, true, 'Users fetched successfully!', users)
}

export const getTotalUsers = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();

    return sendResponse(
      res,
      200,
      true,
      "Total users count fetched successfully",
      { totalUsers }
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      false,
      "Failed to fetch users count"
    );
  }
};
