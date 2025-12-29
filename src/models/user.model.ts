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
        // unique: true,
        lowercase: true,
        pattern: ['^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$']
    },
    // verificationId: {
    //     type: String,
    //     required: true
    // },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Passsword must be at least 8 characters!'],
        select: false,
    },
    referringUserCode: {
        type: String,
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
    isBanned: {
        type: Boolean,
        default: false
    }
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
