import { Request, Response } from "express";
import { OtpModel } from "../models/otp.model";
import User from "../models/user.model";
import { hmacHash } from "../utils/hash-func";
import { sendResponse } from "../utils/response";
import { HttpStatus } from "../constants/http-status";

export const verifyEmailOtp = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        "Email and OTP are required",
        null
      );
    }

    // Find OTP record
    const otpRecord = await OtpModel.findOne({ email });

    if (!otpRecord) {
      return sendResponse(
        res,
        HttpStatus.NOT_FOUND,
        false,
        "OTP not found or already used",
        null
      );
    }

    // Check expiry
    if (otpRecord.expiresAt < Date.now()) {
      await otpRecord.deleteOne();
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        "OTP has expired",
        null
      );
    }

    // Compare hashed OTP
    const hashedOtp = hmacHash(otp);

    if (hashedOtp !== otpRecord.otp) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        "Invalid OTP",
        null
      );
    }

    // Create user OR mark as verified
    const user = await User.findOne({ email });

    if (!user) {
      await User.create({
        email,
        isEmailVerified: true,
      });
    } else {
      user.isEmailVerified = true;
      await user.save();
    }

    // Remove OTP after successful verification
    await otpRecord.deleteOne();

    return sendResponse(
      res,
      HttpStatus.OK,
      true,
      "Email verified successfully",
      null
    );
  } catch (error) {
    console.error(error);
    return sendResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Something went wrong",
      null
    );
  }
};
