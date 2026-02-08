import { Types } from "mongoose";
import { Request, Response } from "express"
import Account from "../../models/account.model";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../constants/http-status";
import { DebitTransactionService } from "../../services/withdrawal.service";
import { getTransactionTotalsService } from "../../services/admins/admin.transaction.service";
import { AccountTransaction } from "../../models/transaction.model";
import { getAllTransactionsAdminService } from "../../services/admins/admin.transaction.service";
import { getTransactionTotalsByStatusService } from '../../services/admins/admin.transaction.service'



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
  try {
    // const { reason } = req.body;

    const withdrawal = await AccountTransaction.findById(req.params.id);
    if (!withdrawal || withdrawal.status !== "pending") {
      return sendResponse(res, 400, false, "Invalid withdrawal request");
    }

    withdrawal.status = "rejected";
    // withdrawal.rejectionReason = reason;
    withdrawal.approvedOrRejectedBy = new Types.ObjectId(req.user.id);

    await withdrawal.save();
    await withdrawal.populate("approvedOrRejectedBy", "email");

    const account = await Account.findById(withdrawal.accountId);
    if (account) {
      account.balance += withdrawal.amount;
      await account.save();
    }

    return sendResponse(res, HttpStatus.OK, true, "Withdrawal rejected", withdrawal);
  } catch (error) {
    return sendResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      "Something went wrong"
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

export const getAllTransactionsAdmin = async (req: Request, res: Response) => {
  try {
    const {
      status,
      type,
      userId,
      reference,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    const data = await getAllTransactionsAdminService({
      status: status as string,
      type: type as string,
      userId: userId as string,
      reference: reference as string,
      startDate: startDate as string,
      endDate: endDate as string,
      page: Number(page),
      limit: Number(limit),
    });

    return sendResponse(
      res,
      HttpStatus.OK,
      true,
      "Transactions fetched successfully",
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


export const getTotalsByStatus = async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate } = req.query;

    const data = await getTransactionTotalsByStatusService({
      type: type as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });

    return sendResponse(
      res,
      HttpStatus.OK,
      true,
      "Transaction totals by status fetched successfully",
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
