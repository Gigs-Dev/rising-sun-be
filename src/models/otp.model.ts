import { Document, Schema, model } from "mongoose";

export interface OtpDocument extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

const OtpSchema = new Schema<OtpDocument>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },

  // Security fields
  attempts: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

/**
 *  Auto-delete expired OTPs (hard guarantee)
 */
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = model<OtpDocument>("Otp", OtpSchema);
