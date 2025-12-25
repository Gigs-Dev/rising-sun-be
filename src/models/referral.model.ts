import mongoose, { model, Schema } from "mongoose";

const referralSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referrals: {
        type: [String],
        default: []
    },
    referalCode: {
        type: String,
        unique: true,
    },
    referralAmt: {
        type: Number,
        default: 0
    }
})

const Referrals = model('Referrals', referralSchema);

export default Referrals;
