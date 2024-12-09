import mongoose, { Document, model, Schema, Types } from "mongoose";

interface ITrade extends Document {
    account: number;
    outcome: 'win' | 'loss' | 'neutral';
    userId: Types.ObjectId;
    createdAt?: Date
}

const TradeSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    tradeType: {
        type: String,
        enum: ['up', 'lost', 'neutral']
    },
    result: {
        type: Boolean,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        required: true
    }
    
}, {timestamps: true}
)


const Trade = model<ITrade>('Trade', TradeSchema);
export default Trade;
