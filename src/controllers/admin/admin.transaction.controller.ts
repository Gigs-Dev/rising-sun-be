import { Request, Response } from "express"
import Withdrawal from "../../models/admin/withdrawal";
import Account from "../../models/account.model";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../constants/http-status";



export const approveWithdrawal = async (req: Request, res: Response) => {
    if (req.user.role !== "super_admin") {
        return sendResponse(res, HttpStatus.FORBIDDEN, false, 'Unauthorized!');
    }

    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal || withdrawal.status !== "PENDING") {
        return res.status(400).json({ message: "Invalid withdrawal request" });
    }

    withdrawal.status = "APPROVED";
    withdrawal.approvedBy = req.user.id; 

    await withdrawal.save();

    return sendResponse(res, HttpStatus.OK, true, 'Withdrawal approved successfully', withdrawal)

}


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
