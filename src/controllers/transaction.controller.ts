import { Request, Response } from "express";
import { FLW_PUBLIC_KEY, FLW_SECRET_KEY } from "../config/env.config";
import Account from "../models/account.model";


const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(FLW_PUBLIC_KEY!, FLW_SECRET_KEY!)


export const creditTransaction = async (req: Request, res: Response) => {
    try {
        const { transaction_id } = req.body;
        const userId = req.user.id; 

        if (!transaction_id) {
        return res.status(400).json({
            success: false,
            message: "transaction_id is required",
        });
        }

        // 1️⃣ Verify transaction
        const response = await flw.Transaction.verify({
        id: Number(transaction_id),
        });

        const data = response.data;

        if (data.status !== "successful") {
        return res.status(400).json({
            success: false,
            message: "Transaction not successful",
        });
        }

        // 2️⃣ Credit account (ATOMIC)
        const account = await Account.findOneAndUpdate(
            { userId },
            { $inc: { balance: data.amount } },
            { new: true }
        );

        if (!account) {
        return res.status(404).json({
            success: false,
            message: "Account not found",
        });
        }

        return res.status(200).json({
            success: true,
            message: "Account credited successfully",
            balance: account.balance,
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export const debitTransaction = async (req: Request, res: Response) => {
    
}


export const transactionHistory = async (req: Request, res: Response) => {
    
}

