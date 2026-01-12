// models/withdrawal.model.ts
import { Schema, model } from "mongoose";

const withdrawalSchema = new Schema(
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
    },

    reference: {
      type: String,
      unique: true,
      required: true,
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
