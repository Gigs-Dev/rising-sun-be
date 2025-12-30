import { Request, Response } from "express";
import Account from "../models/account.model";

export const updateAccount = async (
  req: Request,
  res: Response
): Promise<any> => {

    const userId = req.user.id; // from auth middleware

    const allowedUpdates = ["acctNum", "bankName", "withdrawalPin"];
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

    const userId = req.user.id; // from auth middleware

    const account = await Account.findOne({ userId })
      .select("-withdrawalPin"); // explicit, even though select:false

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