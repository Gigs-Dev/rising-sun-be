import { Request, Response } from "express";
import { FLW_PUBLIC_KEY, FLW_SECRET_KEY } from "../config/env.config";
import Account from "../models/account.model";
import { AccountTransaction } from "../models/transaction.model";
import { sendResponse } from "../utils/sendResponse";
import { HttpStatus } from "../constants/http-status";
import mongoose from "mongoose";
import { hashValidator } from "../utils/func";
import Withdrawal from "../models/admin/withdrawal";
import { AppError } from "../utils/app-error";


const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(FLW_PUBLIC_KEY!, FLW_SECRET_KEY!)


export const creditTransaction = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { transaction_id } = req.body;
        const userId = req.user.id;

        if (!transaction_id) {
            return sendResponse(res, HttpStatus.BAD_REQUEST, false, 'transaction ID is require', null)
        }

        // 1️⃣ Verify Flutterwave transaction
        const response = await flw.Transaction.verify({
        id: Number(transaction_id),
        });

        const data = response.data;

        if (
            data.status !== "successful" ||
            data.amount <= 0 ||
            data.currency !== "NGN" ||
            !data.tx_ref
        ) {
            throw new Error("Invalid or unsuccessful transaction");
        }

        // 2️⃣ Prevent double credit (idempotency)
        const alreadyProcessed = await AccountTransaction.exists({
        reference: data.tx_ref,
        });

        if (alreadyProcessed) {
            throw new Error("Transaction already processed");
        }

        // 3️⃣ Fetch account
        const account = await Account.findOne({ userId }).session(session);

        if (!account) {
        throw new Error("Account not found");
        }

        // 4️⃣ Credit balance (atomic)
        await Account.updateOne(
        { _id: account._id },
        { $inc: { balance: data.amount } },
        { session }
        );

        await AccountTransaction.create([{
            userId,
            accountId: account._id,
            type: 'credit',
            amount: data.amount,
            source: 'deposit',
            status: data.status,
            createdAt: data.created_at,
            payment_type: data.payment_type,
            reference: data.tx_ref,
            currency: data.currency,
            meta: {
                bankName: data.meta.bankname,
                originatorName: data.meta.originatorname
            }
        }],  { session })

        await session.commitTransaction();

        return sendResponse(res, HttpStatus.OK, false, 'Account credited successfully', data)

    } catch (error: any) {
        await session.abortTransaction();

        return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, false, error.message)
    } finally {
        session.endSession();
    }
}


export const debitTransaction = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, withdrawalPin, source } = req.body;
        const userId = req.user.id;

        if (!amount || !withdrawalPin || amount <= 0) {
            throw new Error("Amount and 4-digit withdrawal PIN are required");
        }

        // Fetch account
        const account = await Account.findOne({ userId }).session(session);
        if (!account) throw new Error("Account not found");

        // Verify withdrawal PIN
        const pinValid = await hashValidator(withdrawalPin, account.withdrawalPin);
        if (!pinValid) throw new Error("Invalid withdrawal PIN");

        if (account.balance < amount) throw new Error("Insufficient balance");

        // Debit account
        await Account.updateOne({ _id: account._id }, { $inc: { balance: -amount } }, { session });

        await AccountTransaction.create(
        [
            {
            userId,
            accountId: account._id,
            type: "debit",
            amount,
            source: source || "withdrawal",
            status: "successful",
            reference: `WD-${Date.now()}`, 
            },
        ],
        { session }
        );

        await session.commitTransaction();

        return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, true, 'Withdrawal successful', { balance: account.balance - amount })

    } catch (error) {

        await session.abortTransaction();
        return sendResponse(res, HttpStatus.SERVICE_UNAVAILABLE, false, error.message)
    } finally {
        session.endSession();
    }

}


export const transactionHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const { type, page = 1, limit = 20 } = req.query;

        const query: any = { userId };

        if (type) {
            query.type = type; // credit | debit
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
    const availableBalance = account.balance - account.lockedBalance;
    if (availableBalance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
    }

    // 3️⃣ Lock funds
    account.lockedBalance += amount;
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


