import { Request, Response } from "express";
import Account from "../models/account.model";
import { AccountTransaction } from "../models/transaction.model";
import { sendResponse } from "../utils/sendResponse";
import { HttpStatus } from "../constants/http-status";
import mongoose from "mongoose";
import { hashValidator } from "../utils/func";
import Withdrawal from "../models/admin/withdrawal";
import { AppError } from "../utils/app-error";
import { creditTransactionService, debitTransactionService } from "../services/transaction.service";


export const creditTransaction = async (req: Request, res: Response) => {
  try {
    const { transaction_id } = req.body;
    const userId = req.user.id;

    if (!transaction_id) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        "transaction ID is required"
      );
    }

    const data = await creditTransactionService(userId, Number(transaction_id));

    return sendResponse(
      res,
      HttpStatus.OK,
      true,
      "Account credited successfully",
      data
    );
  } catch (error: any) {
    return sendResponse(
      res,
      error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      error.message
    );
  }
};



export const debitTransaction = async (req: Request, res: Response) => {
  try {
    const data = await debitTransactionService({
      userId: req.user.id,
      ...req.body,
    });

    return sendResponse(
      res,
      HttpStatus.OK,
      true,
      "Withdrawal application successful!",
      data
    );
  } catch (error: any) {
    return sendResponse(
      res,
      error.statusCode || HttpStatus.SERVICE_UNAVAILABLE,
      false,
      error.message
    );
  }
};



export const transactionHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const { type, page = 1, limit = 20 } = req.query;

        const query: any = { userId };

        if (type) {
            query.type = type; // credit | debit | referral
        }

        const transactions = await AccountTransaction.find(query)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

        const total = await AccountTransaction.countDocuments(query);

        return res.status(200).json({
        success: true,
        data: transactions,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
        },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



export const requestWithdrawal = async (req: Request, res:Response) => {
    const user = req.user;
    const { amount, withdrawalPin, bankCode, bankName, accountNum } = req.body;

    if(!amount || !withdrawalPin || !bankCode || !bankName || !accountNum) {
        throw new AppError('Missing required field', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const account = await Account.findOne({ userId: user.id });
    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    // 1️⃣ Validate PIN
    const isPinValid = await hashValidator(withdrawalPin, account.withdrawalPin);
    if (!isPinValid) {
        return res.status(401).json({ message: "Invalid withdrawal PIN" });
    }

    // 2️⃣ Check available balance
    // const availableBalance = account.balance - account.lockedBalance;
    // if (availableBalance < amount) {
    //     return res.status(400).json({ message: "Insufficient balance" });
    // }

    // // 3️⃣ Lock funds
    // account.lockedBalance += amount;
    await account.save();

    // 4️⃣ Create withdrawal request
    const withdrawal = await Withdrawal.create({
        userId: user.id,
        accountId: account.id,
        amount,
        reference: `wd-${Date.now()}`,
        bankSnapshot: {
            acctNum: account.acctNum,
            bankName: account.bankName,
        },
    });

    return sendResponse(res, HttpStatus.OK, true, 'Withdrawal application submitted', withdrawal)

}


