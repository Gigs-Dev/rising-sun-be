import { OtpModel } from '../../model/otp.model';


export async function verifyOtp(email: string, inputCode: string): Promise<boolean> {
    const otpRecord = await OtpModel.findOne({ email }).sort({ expiresAt: -1 });

    if (!otpRecord) return false;

    const currentTime = new Date();
    if (otpRecord.code === inputCode && currentTime <= otpRecord.expiresAt) {
        return true;
    }

    return false;
}

