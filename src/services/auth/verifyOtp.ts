interface Otp {
    code: string;
    expiresAt: Date;
}

export function verifyOtp(otp: Otp, inputCode: string): boolean {
    const currentTime = new Date();

    if (otp.code === inputCode && currentTime <= otp.expiresAt) {
        return true;
    }

    return false; 
}
