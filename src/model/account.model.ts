import mongoose, { model, Schema } from "mongoose";

const AccountSchema = new Schema({
    accountId: {
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
    }
    
}, {timestamps: true}
)


const Account = model('Account', AccountSchema);
export default Account;
