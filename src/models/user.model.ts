import mongoose, { model, Schema } from "mongoose";


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
    }
}, 
    { timestamps: true }
)

const User = model('User', userSchema);

export default User;
