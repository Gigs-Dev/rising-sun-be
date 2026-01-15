import { AccountTransaction } from "../models/transaction.model";
import mongoose from "mongoose";

export const transactionExists = (reference: string) => {
  return AccountTransaction.exists({ reference });
};

export const createAccountTransaction = (
  payload: any,
  session: mongoose.ClientSession
) => {
  return AccountTransaction.create([payload], { session });
};
