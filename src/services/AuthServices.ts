import mongoose from "mongoose";
import { OtpModel } from "../models/otp.model";
import { hmacHash } from "../utils/func";
import { VerifySignupDTO } from "../types/type";
import User from "../models/user.model";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";
import ReferralService from "./ReferralService";



export class AuthServices {
  constructor() {}

  /**
   *  Verifies OTP BEFORE registration
   *  Does NOT create user
   */
  async verifyEmailOtp(email: string, otp: string): Promise<void> {
    email = email.toLowerCase();

    const otpRecord = await OtpModel.findOne({
      email,
      verified: false,
    });

    if (!otpRecord) {
      throw new AppError("OTP not valid or expired", HttpStatus.BAD_REQUEST);
    }

    if (otpRecord.otpExpiresAt.getTime() < Date.now()) {
      throw new AppError("OTP has expired", HttpStatus.BAD_REQUEST);
    }

    const hashedOtp = hmacHash(otp);

    if (hashedOtp !== otpRecord.otp) {
      await OtpModel.updateOne(
        { _id: otpRecord._id },
        { $inc: { attempts: 1 } }
      );

      throw new AppError("Invalid OTP", HttpStatus.BAD_REQUEST);
    }

    await OtpModel.updateOne(
      { _id: otpRecord._id },
      {
        $set: { verified: true, attempts: 0 },
      }
    );
  }


  static async verifySignupAndCreateUser(data: VerifySignupDTO) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      fullName,
      email,
      phoneNumber,
      password,
      referringUserCode,
      verificationId, // 👈 required
    } = data;

    /* -------------------- 0️⃣ VERIFY OTP SESSION -------------------- */
    const otpRecord = await OtpModel.findOne({
      email: email.toLowerCase(),
      verificationId,
      verified: true,
    }).session(session);

    if (!otpRecord) {
      throw new AppError(
        "Invalid or expired verification session",
        HttpStatus.FORBIDDEN
      );
    }

    if (
      !otpRecord.verificationExpiresAt ||
      otpRecord.verificationExpiresAt.getTime() < Date.now()
    ) {
      throw new AppError(
        "Verification session expired",
        HttpStatus.FORBIDDEN
      );
    }

    /* -------------------- 1️⃣ CHECK EXISTING USER -------------------- */
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new AppError(
        "User already exists",
        HttpStatus.CONFLICT_REQUEST
      );
    }

    /* -------------------- 2️⃣ CREATE USER -------------------- */
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password,
    });

    await Promise.all([
      user.save({ session }),
      ReferralService.createReferralProfile(user._id, email, session),
    ]);

    /* -------------------- 3️⃣ HANDLE REFERRAL -------------------- */
    if (referringUserCode && referringUserCode !== email) {
      await ReferralService.rewardReferrer(
        referringUserCode,
        email,
        session
      );
    }

    /* -------------------- 4️⃣ INVALIDATE OTP (SINGLE USE) -------------------- */
    await OtpModel.deleteOne({ _id: otpRecord._id }).session(session);

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
