import { Document, Schema, model } from 'mongoose';

interface OtpDocument extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
}

const OtpSchema = new Schema<OtpDocument>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export const OtpModel = model<OtpDocument>('Otp', OtpSchema);
