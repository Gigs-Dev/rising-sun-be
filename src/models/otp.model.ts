import { Document, Schema, model } from "mongoose";

export interface OtpDocument extends Document {
  email: string;
  otp: string;
  otpExpiresAt: Date;
  attempts: number
  verified: boolean;
  verificationId: string;
  verificationExpiresAt: Date
}

const OtpSchema = new Schema<OtpDocument>({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  otpExpiresAt: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationId: {
    type: String,
    index: true,
  },
  verificationExpiresAt: {
    type: Date,
  },

});



export const OtpModel = model<OtpDocument>("Otp", OtpSchema);
