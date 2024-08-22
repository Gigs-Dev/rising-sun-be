import { OtpModel } from '../../model/otp.model';

interface Otp {
    code: string;
    expiresAt: Date;
}



export async function verifyOtp(email: string, inputCode: string): Promise<boolean> {
    const otpRecord = await OtpModel.findOne({ email }).sort({ expiresAt: -1 });

    if (!otpRecord) return false;

    const currentTime = new Date();
    if (otpRecord.code === inputCode && currentTime <= otpRecord.expiresAt) {
        return true;
    }

    return false;
}


// export function verifyOtp(otp: Otp, inputCode: string): boolean {
//     const currentTime = new Date();

//     if (otp.code === inputCode && currentTime <= otp.expiresAt) {
//         return true;
//     }

//     return false; 
// }
