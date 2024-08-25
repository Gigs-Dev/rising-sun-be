import nodemailer from 'nodemailer';
import { generateRandomOTP } from "../../util/util-gen";
import { OtpModel } from '../../model/otp.model';

interface Otp {
    code: string;
    expiresAt: Date;
}


export async function requestOtp(user: { email: string }): Promise<Otp> {
    const { email } = user;

    const otp = generateRandomOTP().toString();

    const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS,  
        },
    });

    const mailOptions = {
        from:  process.env.EMAIL_USER, 
        to: email,
        subject: 'Rising Sun Inc',
        text: `Your One Time Password is ${otp}, it will expire in 20 mins`,
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
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP');
    }

}  


export const deleteOtp = async (email: string) => {
    try {
        await OtpModel.deleteOne({ email });
    } catch (error) {
        console.error("Failed to delete OTP:", error);
        // Optionally handle the error or log it
    }
};
