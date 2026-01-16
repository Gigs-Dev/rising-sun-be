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
    source: {
      type: String,
      enum: ["referral", "withdrawal", "deposit", "others"],
      required: true,
    },
    status: {
      type: String,
      enum: ["successful", "failed", "reversed", "pending"],
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

export const AccountTransaction = model(
  "Transactions",
  accountTransactionSchema
);
