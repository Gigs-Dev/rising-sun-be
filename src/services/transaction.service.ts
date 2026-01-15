import mongoose from "mongoose";
import { verifyFlutterwaveTransaction } from '../providers/flutterwave.provider';
import {
  findAccountByUserId,
  incrementAccountBalance,
} from "../repository/account.repository";
import {
  transactionExists,
  createAccountTransaction,
} from "../repository/transaction.repository";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";

export const creditAccountService = async (
  userId: string,
  transactionId: number
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = await verifyFlutterwaveTransaction(transactionId);

    if (
      data.status !== "successful" ||
      data.amount <= 0 ||
      data.currency !== "NGN" ||
      !data.tx_ref
    ) {
      throw new AppError("Invalid or unsuccessful transaction", HttpStatus.BAD_REQUEST);
    }

    const alreadyProcessed = await transactionExists(data.tx_ref);
    if (alreadyProcessed) {
      throw new AppError("Transaction already processed", HttpStatus.CONFLICT_REQUEST);
    }

    const account = await findAccountByUserId(userId, session);
    if (!account) {
      throw new AppError("Account not found", HttpStatus.NOT_FOUND);
    }

    await incrementAccountBalance((account._id).toString(), data.amount, session);

    await createAccountTransaction(
      {
        userId,
        accountId: account._id,
        type: "credit",
        amount: data.amount,
        source: "deposit",
        status: data.status,
        createdAt: data.created_at,
        payment_type: data.payment_type,
        reference: data.tx_ref,
        currency: data.currency,
        meta: {
          bankName: data.meta?.bankname,
          originatorName: data.meta?.originatorname,
        },
      },
      session
    );

    await session.commitTransaction();
    return data;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
