import { Request, Response } from "express";
import User from "../models/user.model";
import { sendResponse } from "../utils/sendResponse";
import { generateOTP, hashValidator } from "../utils/func";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";



export const signUp = async (req: Request, res: Response): Promise<any> => {
    const { email, referringUserCode, fullName, password, phoneNumber } = req.body;

    if(!email || !referringUserCode || !fullName || !phoneNumber || !password){
        throw new AppError('Missing required fields', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const userExists = await User.findOne({email});

    if(!userExists) {
        return sendResponse(res, HttpStatus.CONFLICT_REQUEST, false, 'User already exist', null)
    }

    const user = new User({
        email,
        fullName,
        password,
        phoneNumber,
        referalCode: email,
        ...req.body
    })

    //  Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    sendResponse(res, HttpStatus.CREATED, true, 'User created successfully!', user);

}


export const verifyOTP = async (req: Request, res: Response): Promise<any> => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError('User not found or does not exist', HttpStatus.NOT_FOUND)
    } 

    if (user.isVerified) {
        throw new AppError('User already verified, please login', HttpStatus.NOT_ALLOWED)
    } 

    if (user.otp !== otp) {
         throw new AppError('OTP not valid or expired', HttpStatus.NOT_ALLOWED)
    } 

    if (user.otpExpiresAt < Date.now()) {
        return res.status(400).json({ message: 'OTP expired' });
    } 

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });

}


export const signIn = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body;

    if(!email || !password){
        throw new AppError('Missing required fields', HttpStatus.BAD_REQUEST)
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        sendResponse(res, 401, false, 'Invalid credentials', null);
        return
    }

    const isPasswordValid = await hashValidator(password, user.password);

    if(!isPasswordValid){
        sendResponse(res, HttpStatus.UNAUTHORIZED, false, 'Please provide a valid credential', null)
    }

    sendResponse(res, HttpStatus.OK, true, 'Login successfully!', user)
}


export const signOut = async (req:Request, res:Response) => {
    res.clearCookie('Authorization')
    .status(200)
    .json({success: true, message: 'Logged out successfully!'})
}

