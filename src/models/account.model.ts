import { Schema, model } from "mongoose";
import { doHash } from "../utils/func";

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
    },
    bankName: {
      type: String,
    },
    withdrawalPin: {
      type: String,
      select: false, 
      match: [/^\d{4}$/, "Withdrawal PIN must be exactly 4 digits"],
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "frozen", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

accountSchema.pre("save", async function () {
  if (!this.isModified("withdrawalPin")) return;

  this.withdrawalPin = await doHash(this.withdrawalPin, 10);

});

const Account = model("Account", accountSchema);

export default Account;
