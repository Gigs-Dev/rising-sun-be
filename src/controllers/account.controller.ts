import { Request, Response } from "express";
import Account from "../models/account.model";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";
import { hashValidator } from "../utils/func";
import { sendResponse } from "../utils/sendResponse";

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


export const updateWithdrawalPin = async (req:Request, res: Response) => {
  const userId = req.user.id;

  const { withdrawalPin, newPin } = req.body;

  const account = await Account.findById(userId);

  if (!account) {
    return sendResponse(res, 404, false, 'Account does not exist');
  }

  if(!withdrawalPin || !newPin){
    throw new AppError('Missing required field', HttpStatus.UNPROCESSABLE_ENTITY)
  }

  const isMatch = await hashValidator(withdrawalPin, account.withdrawalPin)

  if (!isMatch) {
    return sendResponse(res, 401, false, 'Old password is incorrect');
  }

  if (withdrawalPin === newPin) {
    return sendResponse(
      res,
      400,
      false,
      'New pin must be different from old pin'
    );
  }

  account.withdrawalPin = newPin;

  await account.save();

  sendResponse(res, 200, true, 'Withdrawal pin updated successfully');
  
}
