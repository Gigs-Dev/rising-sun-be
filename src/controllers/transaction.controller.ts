import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { HttpStatus } from "../constants/http-status";
import { creditTransactionService, debitTransactionService, getTransactionHistoryService } from "../services/transaction.service";



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
    const { type, status, page = 1, limit = 20 } = req.query;

    const data = await getTransactionHistoryService({
      userId,
      type: type as string,
      status: status as string,
      page: Number(page),
      limit: Number(limit),
    });

    return sendResponse(
      res,
      HttpStatus.OK,
      true,
      "Transaction history fetched successfully",
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

