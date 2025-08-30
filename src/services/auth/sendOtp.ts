import nodemailer from 'nodemailer';
import { OtpModel } from '../../model/otp.model';
import { sendRegistrationOTP } from '../../templates/mailTemplate'; 

interface Otp {
    code: string;
    expiresAt: Date;
}

export async function sendOtp(user: { email: string }, subject: string, otp: string): Promise<Otp> {
    const { email } = user;

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'officialsrisingsun@gmail.com',
            pass: 'ibfg osdx rpay etwx ',
        },
    });

    const mailOptions = {
        from: `'Rising Sun Inc' <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: sendRegistrationOTP(email, otp),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);

        await OtpModel.create({
            email,
            code: otp,
            expiresAt,
        });

        return { code: otp, expiresAt };
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Failed to send OTP');
    }
}



export const deleteOtp = async (email: string) => {
    try {
        await OtpModel.deleteOne({ email });
    } catch (error) {
        console.error("Failed to delete OTP:", error);
    }
};
