import { model, Schema } from "mongoose";

const referralSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,

    },
    referrals: {
      type: [String], 
      default: [],
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
