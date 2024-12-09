import mongoose, { Document, model, Schema, Types } from "mongoose";

interface ITrade extends Document {
    account: number;
    outcome: 'up' | 'down' | 'neutral';
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
        enum: ['up', 'down', 'neutral']
    },
    result: {
        type: Boolean,
        required: true
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
         ref: 'User',
        required: true
    }
    
}, {timestamps: true}
)


const Trade = model<ITrade>('Trade', TradeSchema);
export default Trade;
