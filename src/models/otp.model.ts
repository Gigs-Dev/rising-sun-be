import { Document, Schema, model } from 'mongoose';

interface OtpDocument extends Document {
    email: string;
    code: string;
    expiresAt: Date;
}

const OtpSchema = new Schema<OtpDocument>({
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export const OtpModel = model<OtpDocument>('Otp', OtpSchema);
