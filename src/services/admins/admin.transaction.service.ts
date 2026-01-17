import mongoose from "mongoose";
import { AccountTransaction } from "../../models/transaction.model";
import { AdminTransactionQuery } from "../../types/type";

interface TransactionTotalOptions {
  userId: string;
  type?: "credit" | "debit";
  from?: string;
  to?: string;
}

interface StatusTotalsQuery {
  type?: string;
  startDate?: string;
  endDate?: string;
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



export const getAllTransactionsAdminService = async ({
  status,
  type,
  userId,
  reference,
  startDate,
  endDate,
  page = 1,
  limit = 20,
}: AdminTransactionQuery) => {
  const query: any = {};

  if (status) {
    query.status = status;
  }

  if (type) {
    query.type = type;
  }

  if (userId) {
    query.userId = userId;
  }

  if (reference) {
    query.reference = reference;
  }

  // ✅ Date range filter
  if (startDate || endDate) {
    query.createdAt = {};

    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    AccountTransaction.find(query)
      .populate("userId", "email name")
      .populate("accountId", "balance")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AccountTransaction.countDocuments(query),
  ]);

  return {
    transactions,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};



export const getTransactionTotalsByStatusService = async ({
  type,
  startDate,
  endDate,
}: StatusTotalsQuery) => {
  const match: any = {};

  if (type) {
    match.type = type; // credit | debit
  }

  if (startDate || endDate) {
    match.createdAt = {};

    if (startDate) {
      match.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      match.createdAt.$lte = new Date(endDate);
    }
  }

  const totals = await AccountTransaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
        totalAmount: 1,
      },
    },
  ]);

  return totals;
};
