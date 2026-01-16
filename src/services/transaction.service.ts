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
import Account from "../models/account.model";
import { AccountTransaction } from "../models/transaction.model";
import { hashValidator } from "../utils/func";


interface DebitTransactionPayload {
  userId: string;
  amount: number;
  withdrawalPin: string;
  bankCode: string;
  bankName: string;
  accountNum: string;
}



export const creditTransactionService = async (
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



export const debitTransactionService = async ({
  userId,
  amount,
  withdrawalPin,
  bankCode,
  bankName,
  accountNum,
}: DebitTransactionPayload) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!amount || amount <= 0 || !withdrawalPin || !bankCode || !bankName || !accountNum) {
      throw new AppError("Missing required fields", 400);
    }

    const account = await Account.findOne({ userId }).session(session);
    if (!account) throw new AppError("Account not found", 404);

    const pinValid = await hashValidator(withdrawalPin, account.withdrawalPin);
    if (!pinValid) throw new AppError("Invalid withdrawal PIN", 400);

    if (account.balance < amount) {
      throw new AppError("Insufficient balance", 400);
    }

    await Account.updateOne(
      { _id: account._id },
      { $inc: { balance: -amount } },
      { session }
    );

    await AccountTransaction.create(
      [
        {
          userId,
          accountId: account._id,
          type: "debit",
          amount,
          source: "withdrawal",
          currency: 'NGN',
          reference: `WD-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
          status: "pending",
          meta: {
            bankName,
            accountNumber: accountNum,
            bankCode,
          },
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      balance: account.balance - amount,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
