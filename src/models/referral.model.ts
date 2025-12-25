import mongoose, { model, Schema } from "mongoose";

const referralSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Referrals = model('Referrals', referralSchema);

export default Referrals;
