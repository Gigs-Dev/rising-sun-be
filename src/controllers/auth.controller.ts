import { Request, Response } from "express";
import User from "../models/user.model";
import { sendResponse } from "../utils/sendResponse";

export const signUp = async (req: Request, res: Response): Promise<void> => {
    const { email, refId, fullName, password } = req.body;

    if(!email || !refId || !fullName || !password){
        throw new Error('Missing required fields')
    }

    const userExists = await User.findOne({email});

}

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {

}

export const signIn = async (req: Request, res: Response): Promise<void> => {

}
