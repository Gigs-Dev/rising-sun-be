import mongoose, { model, Schema } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    referalId: {
        type: String,
        required: true,
        unique: true
    },
    referals: {
        type: Array,
        default: []
    }
}, { timestamps: true })

const User = model('User', UserSchema);

export default User;
