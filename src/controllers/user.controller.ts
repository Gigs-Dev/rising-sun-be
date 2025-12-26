import { Request, Response } from "express";
import User from "../models/user.model";
import { sendResponse } from "../utils/sendResponse";

export const getAllUsers = async (req:Request, res: Response) => {
    const users = await User.find();

    if(!users || users.length === 0){
        sendResponse(res, 404, false, 'Users not found')
    }
    
    sendResponse(res, 200, true, 'Users fetched successfully!', users)
}


export const getUserDetails = async (req:Request, res: Response) => {
    const user = await User.findById(req.params.id)

    if(!user){
        sendResponse(res, 404, false, 'User does not exist')
    }

    sendResponse(res, 200, true, 'User details fetched successfully!', user)
}

export const updateUserDetails = async (req:Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if(user){
         sendResponse(res, 404, false, 'User does not exist')
    }

}

export const updateUserPassword = async (req:Request, res: Response) => {

}

