import mongoose, { model, Schema, Types } from "mongoose";

interface IAccount extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    type: 'credit' | 'debit';
    status: 'idle' | 'pending' | 'successful' | 'failed';
    ref: string;
    createdAt: Date;
  }
  

const TransactionSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
    },
    amount: { 
        type: Number, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['credit', 'debit'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['idle', 'pending', 'success', 'failed'], 
        default: 'idle' 
    },
    ref: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date,
        default: Date.now
    },
    account_number: {
        type: Number, 
    },
    currency: {
        type: String, 
    },
    account_bank: {
        type: String, 
    },
    reference:{
        type: String, 
    },
    narration: {
        type: String
    }
}, {timestamps: true})


const Transaction = model<IAccount>('Transaction', TransactionSchema);
export default Transaction;
