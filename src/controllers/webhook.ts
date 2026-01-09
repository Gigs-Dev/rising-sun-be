import { Request, Response } from "express";
import mongoose from "mongoose";
import Account from "../models/account.model";
import { AccountTransaction } from "../models/transaction.model";
import crypto from "crypto";
import { FLW_SECRET_KEY } from "../config/env.config";

// Utility to verify Flutterwave signature
const verifyFlutterwaveSignature = (req: Request) => {
  const signature = req.headers["verif-hash"] as string;
  const hash = crypto
    .createHmac("sha256", FLW_SECRET_KEY!)
    .update(JSON.stringify(req.body))
    .digest("hex");

  return signature === hash;
};

export const flutterwaveWebhook = async (req: Request, res: Response) => {
  if (!verifyFlutterwaveSignature(req)) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payload = req.body.data;
    const txRef = payload.tx_ref;
    const userId = payload.customer?.id; // adapt if your frontend sends user id in metadata
    const amount = payload.amount;
    const currency = payload.currency;

    if (payload.status !== "successful") {
      return res.status(200).json({ success: true, message: "Transaction not successful, ignored." });
    }

    // Prevent double credit
    const exists = await AccountTransaction.exists({ reference: txRef });
    if (exists) {
      return res.status(200).json({ success: true, message: "Transaction already processed" });
    }

    // Fetch user account
    const account = await Account.findOne({ userId }).session(session);
    if (!account) throw new Error("Account not found");

    // Credit balance
    await Account.updateOne({ _id: account._id }, { $inc: { balance: amount } }, { session });

    // Record transaction
    await AccountTransaction.create(
      [
        {
          userId,
          accountId: account._id,
          type: "credit",
          amount,
          source: "deposit",
          status: "successful",
          reference: txRef,
          currency,
          meta: {
            paymentType: payload.payment_type,
            flutterwaveCreatedAt: payload.created_at,
            bankName: payload.meta?.bankname,
            originatorName: payload.meta?.originatorname,
          },
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({ success: true, message: "Account credited via webhook" });

  } catch (error: any) {
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};
