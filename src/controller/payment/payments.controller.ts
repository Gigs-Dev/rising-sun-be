import { Response, Request } from "express";
import Transaction from '../../model/account.model';
import User from "../../model/user.model";
import { handle500Errors } from "../../util/api-response";
import { createWithrawal } from "../../services/transaction/payment";



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
const { transactionId } = req.body;

    try {

        const response = await flw.Transaction.verify({ id: Number(transactionId) });
        console.log(response);

        if (response.data.status !== "successful") {
            return res.status(400).json({ message: response.message })
        }

        const transactionData = response.data;

        const user = await User.findById(req.userId);
        
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const previousTransaction = await Transaction.findOne({ userId: user._id, type: 'credit', status: 'success' });
        
        await Transaction.create({
            userId: user._id,
            amount: transactionData.amount,
            type: 'credit',
            status: 'success',
            ref: transactionData.flw_ref,
            currency: transactionData.currency,

        });
        
        user.acctBal += transactionData.amount;

        await user.save();

        if (!previousTransaction && user.referalId) {
            const referrer = await User.findOne({ referalCode: user.referalId });

            if(!referrer) return
            referrer.acctBal += 1000; // Reward amount
            await referrer.save();
        }

        return res.status(200).json({
            message: "Transaction verified and account credited successfully",
            acctBal: user.acctBal,
        });
        
        } catch (error: any) {
            res.status(500).json({ message: error.message });
    }
};


export const withdrawal = async (req: Request, res: Response) => {
    const { account_bank, account_number, amount } = req.body;
    try {
        const id = req.userId;
        if(!id){
            return  res.status(400).json({ message: 'Invalid user operation' });
        }

        const user = await User.findOne({_id: id})

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (Number(user.acctBal) < Number(amount)) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const response = await createWithrawal(account_bank, account_number, amount);
        console.log(response);

        const transactionData = response.data;

        if (response.status === "success") {
            await Transaction.create({
                userId: user._id,
                amount: transactionData.amount,
                type: 'debit',
                status: 'success',
                ref: transactionData.reference,
                currency: transactionData.currency,
                account_bank: transactionData.bank_name,
                account_name: transactionData.full_name
            });
           return res.status(200).json({data: response.data,  msg: 'Transaction successful', bal: user.acctBal });

        } else {

            return res.status(500).json({ message: 'Transaction failed', msg: response.message });
        }

    } catch (error: any) {
        res.status(500).json(error.message);
    }
}


export const paymentHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const history = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

        if(!history){
            return res.status(404).json({ message: 'No transaction found for user' });
        }

        res.status(200).json(history);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
