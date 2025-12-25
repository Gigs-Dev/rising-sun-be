import mongoose, { model, Schema } from "mongoose";
import { doHash } from "../utils/func";
import { UserType } from "../types/type";


const userSchema = new Schema<UserType>({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        select: false,
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Passsword must be at least 8 characters!'],
        select: false,
    },
    referringUserCode: {
        type: String,
        unique: true,
    },
    referalCode: {
        type: String,
        unique: true,
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

    const user = this as mongoose.HydratedDocument<UserType>;

    if (!user.isModified('password')) return;

    user.password = await doHash(this.password, 10);

})

const User = model<UserType>('User', userSchema);

export default User;
