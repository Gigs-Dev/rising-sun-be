import mongoose, { model, Schema, Types } from "mongoose";

const TradeSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    outcome: {
        type: String,
        enum: ['win', 'lost', 'neutral']
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User'
    }

}, {timestamps: true}
)


const Trade = model('Trade', TradeSchema);
export default Trade;
