import { Schema, model } from "mongoose";

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
      required: true,
      unique: true,
    },

    withdrawalPin: {
      type: String,
      required: true,
      select: false, 
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

const Account = model("Account", accountSchema);

export default Account;