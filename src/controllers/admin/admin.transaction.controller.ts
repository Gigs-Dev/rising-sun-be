import { Request, Response } from "express"
import Withdrawal from "../../models/admin/withdrawal";
import Account from "../../models/account.model";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../constants/http-status";
import { WithdrawalService } from "../../services/withdrawal.service";


export const approveAndSendWithdrawal = async (
  req: Request,
  res: Response
) => {

   try {
    const result = await WithdrawalService.approveAndSend(
      req.params.id,
      req.user.id
    );

    return sendResponse(res, 200, true, result.message, result.withdrawal);
  } catch (error: any) {
    return sendResponse(res, 400, false, error.message);
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
