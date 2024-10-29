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
        // unique: true,
        ref: 'User'
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
        enum: ['idle', 'pending', 'successful', 'failed'], 
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
        required: true 
    },
    currency: {
        type: String, 
        required: true 
    },
    account_bank: {
        type: String, 
        required: true 
    }
}, {timestamps: true})


const Transaction = model<IAccount>('Transaction', TransactionSchema);
export default Transaction;
