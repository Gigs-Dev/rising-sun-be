import { Schema, model } from "mongoose";
import { doHash } from "../utils/func";
import { NextFunction } from "express";

const accountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    acctNum: {
      type: String,
      match: [/^\d{10}$/, "Account number must be exactly 10 digits"],
    },
    bankName: {
      type: String,
    },
    withdrawalPin: {
      type: String,
      match: [/^\d{4}$/, "Withdrawal PIN must be exactly 4 digits"],
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

accountSchema.pre("save", async function (next: NextFunction) {
  if (!this.isModified("withdrawalPin")) return next();

  this.withdrawalPin = await doHash(this.withdrawalPin, 10);

  next()

});

const Account = model("Account", accountSchema);

export default Account;
