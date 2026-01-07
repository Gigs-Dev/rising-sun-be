import { Schema, model } from "mongoose";

const accountTransactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    reference: {
      type: String,
      required: true,
      unique: true, 
    },
    source: {
      type: String,
      enum: ['referral', 'withdrawal', 'deposit', "others"],
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'failed', 'reversed', 'pending'],
      default: "pending",
    },
    meta: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export const AccountTransaction = model(
  "AccountTransaction",
  accountTransactionSchema
);
