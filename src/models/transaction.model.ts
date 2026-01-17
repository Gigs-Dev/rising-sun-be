import { Schema, model } from "mongoose";

const accountTransactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      index: true,
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    reference: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
    payment_type: String,
    currency: {
      type: String,
      default: "NGN",
    },
    rejectionReason: String,
    approvedOrRejectedBy: {
      type: Schema.Types.ObjectId,
      // type: String
      ref: "User",
    },
    source: {
      type: String,
      enum: ["referral", "withdrawal", "deposit", "others"],
      required: true,
    },
    status: {
      type: String,
      enum: ["successful", "failed", "reversed", "pending", 'rejected'],
      default: "pending",
      index: true,
    },
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Indexes
accountTransactionSchema.index({ userId: 1, createdAt: -1 });
accountTransactionSchema.index({ userId: 1, status: 1 });
accountTransactionSchema.index({ userId: 1, type: 1 });
accountTransactionSchema.index({ status: 1 });
accountTransactionSchema.index({ type: 1 });
accountTransactionSchema.index({ reference: 1 }, { unique: true, sparse: true });
accountTransactionSchema.index({ userId: 1, createdAt: -1 });


export const AccountTransaction = model(
  "Transactions",
  accountTransactionSchema
);
