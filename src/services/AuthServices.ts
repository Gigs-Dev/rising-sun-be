import { OtpModel } from "../models/otp.model";
import { hmacHash } from "../utils/func";

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
     * ✅ OTP is valid
     * Mark as verified (temporary state)
     */
    otpRecord.verified = true;
    await otpRecord.save();
  }
}
