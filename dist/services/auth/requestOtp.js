"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestOtp = requestOtp;
const nodemailer_1 = __importDefault(require("nodemailer"));
const util_gen_1 = require("../../util/util-gen");
const otp_model_1 = require("../../model/otp.model");
function requestOtp(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = user;
        const otp = (0, util_gen_1.generateRandomOTP)().toString();
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000);
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Rising Sun Inc',
            text: `Your One Time Password is ${otp}, it will expire in 20 mins`,
        };
        try {
            yield transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email}`);
            yield otp_model_1.OtpModel.create({
                email,
                code: otp,
                expiresAt,
            });
            return { code: otp, expiresAt };
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send OTP');
        }
    });
}
