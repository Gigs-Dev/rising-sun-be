// models/withdrawal.model.ts
import { Schema, model } from "mongoose";
import { withdrawalType } from "../../types/type";



const withdrawalSchema = new Schema<withdrawalType>(
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
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    bankSnapshot: {
      acctNum: String,
      bankName: String,
      bankCode: Number,
      accountNumber: Number
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "PROCESSING",
        "SUCCESS",
        "FAILED",
      ],
      default: "PENDING",
      index: true
    },
    reference: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: String,
    flutterwave: {
      transferId: String,
      response: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export default model("Withdrawal", withdrawalSchema);
