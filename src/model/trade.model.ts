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
    tradeId: {
        type: Schema.Types.ObjectId,
        ref: 'Acount'
    }

}, {timestamps: true}
)


const Trade = model('Trade', TradeSchema);
export default Trade;
