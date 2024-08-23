import mongoose, { model, Schema, Types } from "mongoose";

interface IAccount extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    type: 'credit' | 'debit';
    status: 'pending' | 'successful' | 'failed';
    flutterwaveRef: string;
    createdAt: Date;
  }
  

const AccountSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        unique: true,
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
    flutterwaveRef: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date,
        default: Date.now
    },
    
})


const Account = model<IAccount>('Account', AccountSchema);
export default Account;
