import Account from "../models/account.model";
import mongoose from "mongoose";

export const findAccountByUserId = (userId: string, session?: mongoose.ClientSession) => {
  return Account.findOne({ userId }).session(session || null);
};

export const incrementAccountBalance = (
  accountId: string,
  amount: number,
  session: mongoose.ClientSession
) => {
  return Account.updateOne(
    { _id: accountId },
    { $inc: { balance: amount } },
    { session }
  );
};
