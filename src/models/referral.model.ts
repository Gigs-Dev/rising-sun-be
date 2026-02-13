import { model, Schema } from "mongoose";

const referralSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referralCode: {
      type: String,
      unique: true,
      required: true
    },
    referrals: {
      type: [String], 
      default: [],
    },
    firstDepositRewarded: {
      type: Boolean,
      default: false
    },
    referralAmt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Referrals = model("Referrals", referralSchema);
export default Referrals;
