import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from 'jsonwebtoken'
import { sendResponse } from "../utils/sendResponse";
import { generateOTP, hashValidator, hmacHash, verifyHmac } from "../utils/func";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";
import transport from "../services/sendEmail";
import { USER_EMAIL } from "../config/env.config";
import { registrationOTPBody } from '../templates/mailTemplate';
import { OtpModel } from "../models/otp.model";
import { AuthServices } from "../services/AuthServices";

const authServices = new AuthServices();

// Request the sign-up otp
export const signUp = async (req: Request, res: Response): Promise<any> => {

    const { email } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        return sendResponse(res, HttpStatus.CONFLICT_REQUEST, false, 'User already exist', null)
    }

    //  Generate OTP
    const otp = generateOTP()
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    //  send mail
    let info = await transport.sendMail({
        from: USER_EMAIL,
        to: email,
        subject: 'RisBet Account Verification',
        html: registrationOTPBody(email, otp)
    })

    // Save to DB
    if(info.accepted[0] === email){
        const data = await OtpModel.create({
            email,
            otp: hmacHash(otp),
            expiresAt: otpExpiresAt
        })

        await data.save()
    }

    sendResponse(res, HttpStatus.OK, true, 'OTP sent! Please check your email to verify your account', );

}


// Verify the sign-up OTP
export const verifySignUpOTP = async (req: Request, res: Response): Promise<any> => {

    const { fullName, email, phoneNumber, password, otp, referringUserCode } = req.body;

    const isVerified = authServices.verifyEmailOtp(email, otp);

    if(!isVerified){
        throw new AppError('Missing required fields', HttpStatus.UNPROCESSABLE_ENTITY);
    }

     const existingUser = await User.findOne({ email });
        if (existingUser) {
        return sendResponse(
            res,
            HttpStatus.CONFLICT_REQUEST,
            false,
            "User already exists",
            null
        );
        }

    if(!email ||!fullName || !phoneNumber || !password){
        throw new AppError('Missing required fields', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      referringUserCode,
      ...req.body
    });


    
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

    const token = jwt.sign({ user: user._id, email: user.email }, 'jwt-secret', { expiresIn: '15m' })

    sendResponse(res, HttpStatus.OK, true, 'Login successfully!', token)
}


export const signOut = async (req:Request, res:Response) => {
    res.clearCookie('Authorization')
    .status(200)
    .json({success: true, message: 'Logged out successfully!'})
}

