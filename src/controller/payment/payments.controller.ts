import { Response, Request } from "express";
import Transaction from '../../model/account.model';
import User from "../../model/user.model";
import { handle500Errors } from "../../util/api-response";
// import Flutterwave  from 'flutterwave-node-v3'


const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);


export const verifyAcctNumber = async (req: Request, res: Response) => {
    const { account_number, account_bank } = req.body;
    try {
        if (!account_number || !account_bank) {
            return res.status(400).json({ message: "Account number and bank code are required." });
        }
        const response = await flw.Misc.verify_Account({ account_number, account_bank });

        if (response.status === "success") {
            // Account verified successfully
            const { account_name } = response.data;

            return res.status(200).json({
                message: "Account verified successfully",
                account_name,
                account_number: response.data.account_number,
            });
        } else {
            // Verification failed
            return res.status(400).json({
                message: response.message || "Account verification failed",
            });
        }
    } catch (error: any) {
        res.status(500).json({ msg: error.message, log: 'Something went wrong!' });

    }
}



export const verifyTransaction = async (req: Request, res: Response) => {
const { transactionId, expectedAmount, expectedCurrency, userId } = req.body;

    try {
        if (!transactionId || !expectedAmount || !expectedCurrency || !userId) {
            return res.status(400).json({ message: "Transaction ID, expected amount, currency, and user ID are required" });
        }

        // Call Flutterwave's transaction verification endpoint
        const response = await flw.Transaction.verify({ id: Number(transactionId) });

        if (response.status === "success") {
        const transactionData = response.data;

        // Verify the transaction details
        if (
            transactionData.status === "successful" &&
            transactionData.amount === expectedAmount &&
            transactionData.currency === expectedCurrency
        ) {
        // Update user's account balance
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.acctBal += transactionData.amount;
        await user.save();

        // Record the transaction in the Transaction schema
        await Transaction.create({
            userId: user._id,
            amount: transactionData.amount,
            type: 'credit',
            status: 'successful',
            ref: transactionData.flw_ref,
            account_number: transactionData.customer.account_number,
            currency: transactionData.currency,
            account_bank: transactionData.customer.account_bank,
        });

        return res.status(200).json({
            message: "Transaction verified and account credited successfully",
            acctBal: user.acctBal,
        });
        } else {
            return res.status(400).json({
                message: "Transaction verification failed. Details did not match expected values.", transactionData, });
            }
        } else {
            return res.status(400).json({ message: response.message || "Failed to fetch transaction details"}) }

        } catch (error: any) {
            res.status(500).json({ message: error.message });
    }
};


export const paymentHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const history = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

        if(!history || history.length === 0){
            return res.status(404).json({ message: 'No transaction found for user' });
        }

        res.status(200).json(history);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
