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
import Referrals from "../models/referral.model";
import { AccountTransaction } from "../models/transaction.model";
import { hashValidator } from "../utils/func";
import { DebitTransactionPayload, HandleReferralFirstDepositParams, TransactionHistoryParams } from "../types/type";




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
      !data.tx_ref
    ) {
      throw new AppError("Invalid or unsuccessful transaction", HttpStatus.BAD_REQUEST);
    }

    const previousCredits = await AccountTransaction.countDocuments({
      userId,
      type: "credit",
    }).session(session);

    const isFirstCredit = previousCredits === 0;

    if (isFirstCredit) {
      await handleReferralFirstDeposit({
        referredUserId: userId,
        amount: 500,
        currency: data.currency,
        reference: data.tx_ref,
        session,
      });
    }


    // const alreadyProcessed = await transactionExists(data.tx_ref);
    // if (alreadyProcessed) {
    //   throw new AppError("Transaction already processed", HttpStatus.CONFLICT_REQUEST);
    // }

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




export const handleReferralFirstDeposit = async ({
  referredUserId,
  amount,
  currency,
  reference,
  session,
}: HandleReferralFirstDepositParams) => {
  /**
   * STEP 1: Get referral profile of the referred user
   * (This tells us the referral code they own)
   */
  const referredProfile = await Referrals.findOne({
    userId: referredUserId,
  }).session(session);

  // User was not referred by anyone
  if (!referredProfile) return;

  /**
   * STEP 2: Find the referrer who owns this referral
   * AND has not been rewarded yet
   */
  const referrerProfile = await Referrals.findOne({
    referrals: referredProfile.referralCode,
    firstDepositRewarded: false,
  }).session(session);

  // Either:
  // - referral already rewarded
  // - referral relationship not found
  if (!referrerProfile) return;

  /**
   * STEP 3: Get referrer's account
   */
  const referrerAccount = await findAccountByUserId(
    referrerProfile.userId.toString(),
    session
  );

  if (!referrerAccount) {
    throw new AppError(
      "Referrer account not found",
      HttpStatus.NOT_FOUND
    );
  }

  /**
   * STEP 4: Credit referrer's account
   */
  await incrementAccountBalance(
    referrerAccount._id.toString(),
    amount,
    session
  );

  /**
   * STEP 5: Create referral transaction record
   */
  await createAccountTransaction(
    {
      userId: referrerProfile.userId,
      accountId: referrerAccount._id,
      type: "credit",
      amount: 500,
      source: "referral",
      status: "successful",
      currency,
      reference: `REF-${reference}`,
      meta: {
        referredUserId,
        originalTxRef: reference,
      },
    },
    session
  );

  /**
   * STEP 6: Lock reward (VERY IMPORTANT)
   * Prevents future deposits from triggering reward again
   */
  await Referrals.updateOne(
    { _id: referrerProfile._id },
    { $set: { firstDepositRewarded: true } },
    { session }
  );
};




export const getTransactionHistoryService = async ({
  userId,
  type,
  status,
  page = 1,
  limit = 20,
}: TransactionHistoryParams) => {
  const query: any = { userId };

  if (type) {
    query.type = type; // credit | debit
  }

  if (status) {
    query.status = status; // pending | successful | failed | reversed
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    AccountTransaction.find(query)
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
