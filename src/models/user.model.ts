import mongoose, { model, Schema } from "mongoose";
import { doHash } from "../utils/hash-func";


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    referalCode: {
        type: String
    },
    referrals: {
        type: [String],
        default: []
    },
    profilePics: {
        type: String
    },
    dob: {
        type: Date
    },
    address: {
        type: String
    },
    // OTP fields
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
}, 
    { timestamps: true }
)

// =====================
// PRE-SAVE HOOK
// =====================
userSchema.pre('save', async function(){

    const user = this as any;

    if (!user.isModified('password')) return;

    user.password = doHash(this.password, 10);
})

const User = model('User', userSchema);

export default User;
