import { Response, Request } from "express";
import Transaction from '../../model/account.model';
import User from "../../model/user.model";
import { handle500Errors } from "../../util/api-response";


declare module 'express-serve-static-core' {
    interface Request {
        userId?: string; 
    }
}

const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);


export const verifyAcctNumber = async (req: Request, res: Response) => {
    const { account_number, account_bank } = req.body;
    try {

        const response = await flw.Misc.verify_Account({ account_number, account_bank });

        if (response.status === 'success') {
  
            const { account_name } = response.data;

            return res.status(200).json({
                message: "Account verified successfully",
                account_name,
                account_number: response.data.account_number,
            });
        } else {

            return res.status(400).json({
                message: response.message, log: "Account verification failed",
            });
        }
    } catch (error: any) {
        res.status(500).json({ msg: error.message, log: 'Something went wrong!' });

    }
}


export const verifyTransaction = async (req: Request, res: Response) => {
const { transactionId, expectedAmount, expectedCurrency } = req.body;

    try {

        const response = await flw.Transaction.verify({ id: Number(transactionId) });
        console.log(response, 'Response');

        if (response?.data?.status === "successful" && response?.data?.amount === expectedAmount && response?.data?.currency === expectedCurrency) {

        const transactionData = response.data;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        
        await Transaction.create({
            userId: user._id,
            amount: transactionData.amount,
            type: 'credit',
            status: 'success',
            ref: transactionData.flw_ref,
            account_number: transactionData.customer.account_number,
            currency: transactionData.currency,
            account_bank: transactionData.customer.account_bank,
        });
        
        user.acctBal += transactionData.amount;

        await user.save();

        return res.status(200).json({
            message: "Transaction verified and account credited successfully",
            acctBal: user.acctBal,
        });
        } else {
            return res.status(400).json({ message: response.message }); }

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
