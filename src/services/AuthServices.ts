import mongoose from "mongoose";
import { OtpModel } from "../models/otp.model";
import { hmacHash } from "../utils/func";
import { VerifySignupDTO } from "../types/type";
import User from "../models/user.model";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";
import ReferralService from "./ReferralService";

const MAX_OTP_ATTEMPTS = 5;

export class AuthServices {
  constructor() {}

  /**
   *  Verifies OTP BEFORE registration
   *  Does NOT create user
   */
  async verifyEmailOtp(email: string, otp: string): Promise<void> {

    const otpRecord = await OtpModel.findOne({ email });

    if (!otpRecord) {
      throw new Error("OTP not found or expired");
    }

    //  Already used
    if (otpRecord.verified) {
      throw new Error("OTP already used");
    }

    //  Too many attempts
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await otpRecord.deleteOne();
      throw new Error("Too many failed attempts. Request a new OTP");
    }

    // Expired (extra safety beyond TTL)
    if (otpRecord.expiresAt.getTime() < Date.now()) {
      await otpRecord.deleteOne();
      throw new Error("OTP has expired");
    }

    const hashedOtp = hmacHash(otp);

    // Wrong OTP
    if (hashedOtp !== otpRecord.otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new Error("Invalid OTP");
    }

    /**
     * OTP is valid
     * Mark as verified (temporary state)
     */
    otpRecord.verified = true;
    await otpRecord.save();
  }



  static async verifySignupAndCreateUser(data: VerifySignupDTO) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const { fullName, email, phoneNumber, password, referringUserCode } =
        data;

      const existingUser = await User.findOne({ email }).session(session);
      if (existingUser) {
        throw new AppError(
          "User already exists",
          HttpStatus.CONFLICT_REQUEST
        );
      }

      /** 1️⃣ Create user */
      const user = new User({
        fullName,
        email,
        phoneNumber, // string
        password,
      });

      await user.save({ session });

      /** 2️⃣ Create referral profile */
      await ReferralService.createReferralProfile(
        user._id,
        email,
        session
      );

      /** 3️⃣ Handle referral reward */
      if (referringUserCode && referringUserCode !== email) {
        await ReferralService.rewardReferrer(
          referringUserCode,
          email,
          session
        );
      }

      await session.commitTransaction();
      session.endSession();

      return user;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

}
