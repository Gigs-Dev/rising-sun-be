import mongoose, { model, Schema } from "mongoose";

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Account = model('Account', accountSchema);

export default Account;
