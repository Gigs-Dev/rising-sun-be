import mongoose, { Document, model, Schema, Types } from "mongoose";


interface IUser extends Document {
    _id: Types.ObjectId;
    acctId: string;
    email: string;
    referalCode?: string;
    referalId?: string;
    referals?: [];
    createdAt?: Date;
    acctType: string;
    acctBal: number;
    isAdmin: boolean;
    _doc: {
        isAdmin: boolean;
    };
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
    referalCode: {
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
    acctBal: {
        type: Number,
        required: true,
        default: 0
    },
    referals: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = model('User', UserSchema);

export default User;
