import { HttpStatus } from "../constants/http-status";
import { OtpModel } from "../models/otp.model";
import { AppError } from "./app-error";


export async function verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpRecord = await OtpModel.findOne({ email }).sort({ expiresAt: -1 });

    if (!otpRecord){
        throw new AppError('Invalid OTP', HttpStatus.BAD_REQUEST)
    }

    const currentTime = new Date().getTime();

    if (otpRecord.otp === otp && currentTime <= otpRecord.otpExpiresAt.getTime()) {
        return true;
    }

    return false

}