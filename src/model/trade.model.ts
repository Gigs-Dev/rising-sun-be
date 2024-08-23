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


const Trade = model<ITrade>('Trade', TradeSchema);
export default Trade;
