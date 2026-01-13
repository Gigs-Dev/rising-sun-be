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
      match: [/^\d{10}$/, "Account number must be exactly 10 digits"],
    },
    bankName: {
      type: String,
    },
    withdrawalPin: {
      type: String,
      min: [3, 'Must be four digits pin'],
      max: [4, 'Must be four digits pin']
    },
    lockedBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
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
