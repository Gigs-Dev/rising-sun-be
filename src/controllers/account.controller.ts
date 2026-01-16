import { Request, Response } from "express";
import Account from "../models/account.model";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";
import { hashValidator } from "../utils/func";
import { sendResponse } from "../utils/sendResponse";
import flutterwave from "../utils/flutterwave";


export const updateAccount = async (
  req: Request,
  res: Response
): Promise<any> => {

    const userId = req.user.id; 

    const allowedUpdates = ["acctNum", "bankName", "withdrawalPin", 'balance'];
    const updates: Record<string, any> = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }

    const account = await Account.findOne({ userId }).select("+withdrawalPin");

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    Object.assign(account, updates);
    await account.save(); // triggers pre-save hooks

    return res.status(200).json({
      message: "Account updated successfully",
    });

};


export const getAccount = async (
  req: Request,
  res: Response
): Promise<any> => {

    const userId = req.user.id; 

    const account = await Account.findOne({ userId })

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    return res.status(200).json({
      message: "Account fetched successfully",
      data: account,
    });

};


export const verifyWithdrawalPin = async (req:Request, res: Response) => {
  const userId = req.user.id;
  const { withdrawalPin } = req.body;

  if (!withdrawalPin ) {
    throw new AppError('Missing required fields', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  const account = await Account.findOne({ user: userId });

  if (!account) {
    return sendResponse(res, 404, false, 'Invalid account or account does not exist');
  }

  const isMatch = await hashValidator(withdrawalPin, account.withdrawalPin);

  if (!isMatch) {
    return sendResponse(res, 401, false, 'PIN is incorrect');
  }

  await account.save();

  return sendResponse(res, 200, true, 'Withdrawal pin verified successfully');
  
}


export const getAllBanks = async (_req: Request, res: Response) => {
  try {
    const response = await flutterwave.get(
      "banks/NG?include_provider_type=1",
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch banks",
      error: error.response?.data || error.message,
    });
  }
};


export const verifyAcctNumber = async (req: Request, res: Response) => {

}

