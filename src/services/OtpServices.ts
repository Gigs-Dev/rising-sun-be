import { OtpModel } from "../models/otp.model";
import { forgotPasswordOTPBody, registrationOTPBody } from "../templates/mailTemplate";
import { SendOtpResult } from "../types/type";
import { hmacHash } from "../utils/func";

import { transport } from "./sendEmail";

type OtpType = "signup" | "forgotPassword";

class OtpService {
  /**
   * Generic OTP sending method
   */
  static async sendOtp(email: string, type: OtpType): Promise<SendOtpResult> {
    // Delete existing OTPs
    await OtpModel.deleteMany({ email });

    // Generate OTP and expiry
    const otp = OtpService.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Select email body and subject based on type
    let html: string;
    let subject: string;

    switch (type) {
      case "signup":
        html = registrationOTPBody(email, otp);
        subject = "RisBet Account Verification";
        break;
      case "forgotPassword":
        html = forgotPasswordOTPBody(email, otp);
        subject = "RisBet Password Reset Verification";
        break;
      default:
        throw new Error("Invalid OTP type");
    }

    // Send OTP email
    const info = await transport.sendMail({
      from: 'officialsrisingsun@gmail.com',
      to: email,
      subject,
      html,
    });

    if (info.accepted[0] !== email) {
      return { success: false, message: "Failed to send OTP email" };
    }

    // Save OTP to DB
    await OtpModel.create({
      email,
      otp: hmacHash(otp),
      otpExpiresAt,
    });

    return { success: true, message: "OTP sent! Please check your email" };
  }

  /**
   * Generate numeric OTP (6 digits)
   */
  private static generateOTP(length = 4): string {
    return Math.floor(1000 + Math.random() * 9000)
      .toString()
      .substring(0, length);
  }

  // Convenience wrappers
  static sendSignUpOtp(email: string) {
    return this.sendOtp(email, "signup");
  }

  static sendForgotPasswordOtp(email: string) {
    return this.sendOtp(email, "forgotPassword");
  }
}

export default OtpService;
