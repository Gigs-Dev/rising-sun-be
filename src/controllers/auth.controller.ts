import { Request, Response } from "express";
import User from "../models/user.model";
import { sendResponse } from "../utils/sendResponse";
import { doHash, hashValidator } from "../utils/func";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";
import { AuthServices } from "../services/AuthServices";
import OtpService from "../services/OtpServices";
import { OtpModel } from "../models/otp.model";
import { signJwt } from "../middleware/verifyToken";
import { accessTokenTtl, refreshTokenTtl } from "../config/env.config";
import { generateAccessToken, generateRefreshToken } from "../utils/token";



const authServices = new AuthServices();

// Request the sign-up otp
export const signUp = async (req: Request, res: Response): Promise<any> => {

    const { email } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return sendResponse(
        res,
        HttpStatus.CONFLICT_REQUEST,
        false,
        "User already exists",
        null
        );
    }

    // Use OTP service
    const result = await OtpService.sendSignUpOtp(email);

    return sendResponse(res, result.success ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR, result.success, result.message);

}


// Verify the sign-up OTP
export const verifySignUpOTP = async (req: Request, res: Response): Promise<any> => {

    const { fullName, email, phoneNumber, password, otp, referringUserCode } = req.body;

    if (referringUserCode === email) {
        throw new AppError("You cannot refer yourself", HttpStatus.BAD_REQUEST);
    }

    const isVerified = authServices.verifyEmailOtp(email, otp);
    if (!isVerified) {
        throw new AppError("OTP not valid or expired", HttpStatus.FORBIDDEN);
    }

    if (!email || !fullName || !phoneNumber || !password) {
        throw new AppError(
        "Missing required fields",
        HttpStatus.UNPROCESSABLE_ENTITY
        );
    }

    const user = await AuthServices.verifySignupAndCreateUser({
        fullName,
        email,
        phoneNumber,
        password,
        referringUserCode,
    });

    /* -------------------- TOKENS -------------------- */
    const accessToken = generateAccessToken({
        id: user._id.toString(),
        role: user.role,
        tokenVersion: user.tokenVersion
    });

    const refreshToken = generateRefreshToken({
        id: user._id.toString(),
        tokenVersion: user.tokenVersion
    });

    /* -------------------- COOKIE -------------------- */
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth/refreshToken',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return sendResponse(res, HttpStatus.OK, true, 'Sign up successfully!', accessToken );

}

// sign-in
export const signIn = async (req: Request, res: Response): Promise<any> => {

    const { email, password } = req.body;

    if(!email || !password){
        throw new AppError('Missing required fields', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return sendResponse(res, 401, false, 'Invalid credentials', null);
    }

    const isPasswordValid = await hashValidator(password, user.password);

    if(!isPasswordValid){
        return sendResponse(res, HttpStatus.UNAUTHORIZED, false, 'Please provide a valid credential', null);
    }

    /* -------------------- TOKENS -------------------- */
    const accessToken = generateAccessToken({
        id: user._id.toString(),
        role: user.role,
        tokenVersion: user.tokenVersion
    });

    const refreshToken = generateRefreshToken({
        id: user._id.toString(),
        tokenVersion: user.tokenVersion
    });

    /* -------------------- COOKIE -------------------- */
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth/refreshToken',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return sendResponse(res, HttpStatus.OK, true, 'Login successfully!', accessToken)
}


// sign-out
export const signOut = async (req:Request, res:Response) => {
    res.clearCookie('refreshToken', {
    path: '/api/auth/refreshToken'
    })
    .status(200)
    .json({success: true, message: 'Logged out successfully!'})
}


export const forgortPassword = async (req:Request, res:Response) => {

    const { email } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
        return sendResponse(
        res,
        HttpStatus.FORBIDDEN,
        false,
        "User does not exist",
        null
        );
    }

    // Use OTP service
    const result = await OtpService.sendForgotPasswordOtp(email);

    return sendResponse(res, result.success ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR, result.success, result.message);

}


// verify password 
export const verfiyForgotPassword = async (req:Request, res:Response): Promise<any> => {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
        throw new AppError("Missing required fields", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isVerified = authServices.verifyEmailOtp(email, otp);
    if (!isVerified) {
        return sendResponse(res, HttpStatus.FORBIDDEN, false, 'OTP not valid or expired!')
    }

     const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    user.password = await doHash(password, 10);

    await Promise.all([user.save(), OtpModel.deleteMany({ email })])

    return sendResponse(res, HttpStatus.OK, true, "Password reset successfully!");

}
