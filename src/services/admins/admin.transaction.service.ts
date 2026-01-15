import mongoose from "mongoose";
import { AccountTransaction } from "../../models/transaction.model";

interface TransactionTotalOptions {
  userId: string;
  type?: "credit" | "debit";
  from?: string;
  to?: string;
}

export const getTransactionTotalsService = async (
  options: TransactionTotalOptions
) => {
  const { userId, type, from, to } = options;

  const matchStage: any = {
    status: "successful",
    userId: new mongoose.Types.ObjectId(userId),
  };

  // Optional type filter
  if (type) {
    matchStage.type = type;
  }

  // Optional date range filter
  if (from || to) {
    matchStage.createdAt = {};

    if (from) {
      matchStage.createdAt.$gte = new Date(from);
    }

    if (to) {
      matchStage.createdAt.$lte = new Date(to);
    }
  }

  const result = await AccountTransaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
        totalTransactions: { $sum: 1 },
      },
    },
  ]);

  return {
    totalAmount: result[0]?.totalAmount || 0,
    totalTransactions: result[0]?.totalTransactions || 0,
  };
};
