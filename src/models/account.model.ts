import mongoose, { model, Schema, Types } from "mongoose";

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }
})

const Account = model('Account', accountSchema);

export default Account;
