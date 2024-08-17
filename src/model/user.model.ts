import mongoose, { model, Schema, Types } from "mongoose";

interface IUser {
    _id: Types.ObjectId;
    email: string;
    referee?: string;
    referalId?: string;
    referals?: [];
    createdAt?: Date;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    referee: String,
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
