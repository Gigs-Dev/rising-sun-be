import { Types } from "mongoose";
import { Request, Response } from "express"
import Withdrawal from "../../models/admin/withdrawal";
import Account from "../../models/account.model";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../constants/http-status";
import { DebitTransactionService } from "../../services/withdrawal.service";
import { getTransactionTotalsService } from "../../services/admins/admin.transaction.service";
import { AccountTransaction } from "../../models/transaction.model";



export const approveAndSendWithdrawal = async (
  req: Request,
  res: Response
) => {

   try {
    const result = await DebitTransactionService.approveAndSend(
      req.params.id,
      req.user.id
    );

    console.log(result)

    // return sendResponse(res, 200, true, result.message, result.);
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message);
  }

};



export const rejectWithdrawal = async (req: Request, res: Response) => {
    const adminId = req.user.id;

    const { reason } = req.body;

    const withdrawal = await AccountTransaction.findById(req.params.id);
    if (!withdrawal || withdrawal.status !== "pending") {
        return res.status(400).json({ message: "Invalid withdrawal request" });
    }

    // Update withdrawal
    withdrawal.status = "rejected";
    withdrawal.rejectionReason = reason;
    withdrawal.approvedOrRejectedBy = new Types.ObjectId(adminId);

    await Promise.all([withdrawal.save(), withdrawal.populate('approvedOrRejectedBy', 'email')])

    // await withdrawal.save();
    // await withdrawal.populate('approvedOrRejectedBy', 'email');

    // Unlock funds
    const account = await Account.findById(withdrawal.accountId);
    if (account) {
        account.balance += withdrawal.amount;
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


export const getTotalTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { type, from, to } = req.query;
    const userId = req.user.id;

    // Validate type
    if (type && !["credit", "debit"].includes(type as string)) {
      return sendResponse(
        res,
        HttpStatus.BAD_REQUEST,
        false,
        "type must be either credit or debit"
      );
    }

    const totals = await getTransactionTotalsService({
      userId,
      type: type as "credit" | "debit",
      from: from as string,
      to: to as string,
    });

    return sendResponse(
      res,
      HttpStatus.OK,
      true,
      "Transaction totals fetched successfully",
      {
        ...totals,
        type: type || "all",
        from: from || null,
        to: to || null,
      }
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


