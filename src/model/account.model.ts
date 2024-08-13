import mongoose, { model, Schema } from "mongoose";



const AccountSchema = new Schema({
    email: {
        type: String,
        unique: true
    }
}, { timestamps: true })

const Account = model('Account', AccountSchema);

export default Account;
