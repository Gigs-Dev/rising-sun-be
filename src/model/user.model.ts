import mongoose, { model, Schema, Types } from "mongoose";

interface IUser {
    _id: Types.ObjectId;
    acctId: string;
    email: string;
    refereeId?: string;
    referalId?: string;
    referals?: [];
    createdAt?: Date;
    acctType: string;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    acctId: {
        type: String,
        unique: true
    },
    refereeId: {
        type:String
    },
    referalId: {
        type: String,
        required: true,
        unique: true
    },
    acctType: {
        type: String,
        required: true,
        enum: ['real', 'demo'],
    },
    referals: {
        type: Array,
        default: []
    }
}, { timestamps: true })

const User = model('User', UserSchema);

export default User;
