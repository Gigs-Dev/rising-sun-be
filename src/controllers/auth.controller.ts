import { Request, Response } from "express";
import User from "../models/user.model";
import { sendResponse } from "../utils/sendResponse";
import { doHash, generateVerificationId, hashValidator } from "../utils/func";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";
import { AuthServices } from "../services/AuthServices";
import OtpService from "../services/OtpServices";
import { OtpModel } from "../models/otp.model";
import { privateKey } from "../config/env.config";
import Referrals from "../models/referral.model";
import { signAccessToken, signRefreshToken } from "../utils/jwt-util";
import Account from "../models/account.model";




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
export const verifySignUpOTP = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, otp } = req.body;

  await authServices.verifyEmailOtp(email, otp);

  const verificationId = generateVerificationId();

  await OtpModel.updateOne(
    { email: email.toLowerCase(), verified: true },
    {
      $set: {
        verificationId,
        verificationExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      },
    }
  );

  return sendResponse(res, HttpStatus.OK, true, "OTP verified successfully!", {
    verificationId,
  });
};




export const createUser = async (req: Request, res: Response): Promise<any> => {

    const { fullName, email, phoneNumber, password, verificationId, referringUserCode } = req.body;

    if (referringUserCode === email) {
        throw new AppError("You cannot refer yourself", HttpStatus.BAD_REQUEST);
    }

    if (!email || !fullName || !phoneNumber || !password || !verificationId) {
        throw new AppError( "Missing required fields", HttpStatus.UNPROCESSABLE_ENTITY );
    }

    const userExists = await User.findOne({email})

    if(userExists){
      return sendResponse(res, HttpStatus.CONFLICT_REQUEST, false, 'User already exist')
    }

    const user = await AuthServices.verifySignupAndCreateUser({ fullName, email, phoneNumber, password, referringUserCode, verificationId });

    const userAcct = new Account({
        userId: user._id
    })

    await Promise.all([user.save(), userAcct.save()]);

    return sendResponse(res, HttpStatus.CREATED, true, 'Sign up successfully!', null );

}


// sign-in
export const signIn = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Missing required fields', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  const emailNormalized = email.toLowerCase().trim();

  const user = await User.findOne({ email: emailNormalized }).select('+password');
  if (!user) {
    return sendResponse(res, HttpStatus.UNAUTHORIZED, false, 'Invalid credentials', null);
  }

  if (user.isBanned) {
    return sendResponse(res, HttpStatus.FORBIDDEN, false, 'Account is suspended', null);
  }

  const isPasswordValid = await hashValidator(password, user.password);
  if (!isPasswordValid) {
    return sendResponse(res, HttpStatus.UNAUTHORIZED, false, 'Invalid credentials', null);
  }

  const [referral, account] = await Promise.all([
    Referrals.findOne({ userId: user._id }).lean(),
    Account.findOne({ userId: user._id }).lean(),
  ]);

  const tokenPayload = {
    id: user._id.toString(),
    role: user.role,
    isBanned: user.isBanned,
  };

  const accessToken = signAccessToken(tokenPayload, privateKey);
  const refreshToken = signRefreshToken(tokenPayload, privateKey);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/refreshToken',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userSafe = user.toObject();
  delete userSafe.password;

  return sendResponse(res, HttpStatus.OK, true, 'Login successfully!', {
    accessToken,
    user: userSafe,
    userDetails: { referral, account },
  });
};



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
