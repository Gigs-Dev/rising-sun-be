import mongoose, { model, Schema } from "mongoose";

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    acctNum: {
        type: String,
        required: true,
    },
    withdrawalPin: {
        type: String,
        required: true,
    },
    acctBal: {
       type: Number,
       default: 0
    },
    
})

const Account = model('Account', accountSchema);

export default Account;
