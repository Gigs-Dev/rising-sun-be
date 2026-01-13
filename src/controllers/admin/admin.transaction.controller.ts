import { Request, Response } from "express"
import Withdrawal from "../../models/admin/withdrawal";
import Account from "../../models/account.model";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../constants/http-status";
import { Types } from "mongoose";
import flutterwave from "../../utils/flutterwave";
import { AccountTransaction } from "../../models/transaction.model";
import { API_URL } from "../../config/env.config";


export const approveAndSendWithdrawal = async (
  req: Request,
  res: Response
) => {

  const withdrawal = await Withdrawal.findById(req.params.id);

  console.log(withdrawal)

  if (!withdrawal || withdrawal.status !== "PENDING") {
    return sendResponse(
      res,
      HttpStatus.BAD_REQUEST,
      false,
      "Invalid withdrawal request"
    );
  }

  // // 1️⃣ Approve internally
  withdrawal.status = "PROCESSING";
  withdrawal.approvedBy = new Types.ObjectId(req.user.id);
  await withdrawal.save();

  try {
    // 2️⃣ Send payout to Flutterwave
    const response = await flutterwave.post("/transfers", {
      account_bank: withdrawal.bankSnapshot.bankCode, // IMPORTANT
      account_number: withdrawal.bankSnapshot.acctNum,
      amount: withdrawal.amount,
      currency: "NGN",
      narration: "User withdrawal",
      reference: withdrawal.reference,
      callback_url: `${API_URL}webhooks/flutterwave`,
    });

    const data = response.data;

  //   // 3️⃣ Save Flutterwave metadata
    withdrawal.flutterwave = {
      transferId: response.data.data.id,
      response: response.data,
    };
    withdrawal.status = "APPROVED";
    await withdrawal.save();

    await AccountTransaction.create({
        userId: withdrawal.userId,
        accountId: withdrawal.accountId,
        type: 'debit',
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
    })

    return sendResponse(
      res,
      HttpStatus.OK,
      true,
      "Withdrawal approved and payout initiated",
      withdrawal
    );
  } catch (error: any) {
    // 🚨 VERY IMPORTANT: revert state
    withdrawal.status = 'FAILED'; // approved but not sent
    await withdrawal.save();

    return sendResponse(
      res,
      HttpStatus.SERVICE_UNAVAILABLE,
      false,
      "Withdrawal approved but payout failed. Retry required.",
      error.response?.data || error.message
    );
  }
};



export const rejectWithdrawal = async (req: Request, res: Response) => {
    const { reason } = req.body;

    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal || withdrawal.status !== "PENDING") {
        return res.status(400).json({ message: "Invalid withdrawal request" });
    }

    // 1️⃣ Update withdrawal
    withdrawal.status = "REJECTED";
    withdrawal.rejectionReason = reason;
    await withdrawal.save();

    // 2️⃣ Unlock funds
    const account = await Account.findById(withdrawal.accountId);
    if (account) {
        account.lockedBalance -= withdrawal.amount;
        await account.save();
    }

    return sendResponse(res, HttpStatus.OK, true, 'Withdrawal rejected', withdrawal)

}



export const getUserWithdrawalHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [withdrawals, total] = await Promise.all([
      Withdrawal.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Withdrawal.countDocuments({ user: userId }),
    ]);

    return sendResponse(res, HttpStatus.OK, true, "Withdrawal history fetched", {
      data: withdrawals,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return sendResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Failed to fetch withdrawal history"
    );
  }
};
