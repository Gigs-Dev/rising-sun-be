import { Request, Response } from "express";
import Transaction from "../../model/account.model";
import User from "../../model/user.model";
import { handle500Errors } from "../../util/api-response";
import axios from 'axios';


export const creditAccount = async (req:Request, res: Response): Promise<void> => {
    try {
        const { userId, transactionRef } = req.body;
        
         const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;

         const res = await axios.get(`https://api.flutterwave.com/v3/transactions/${transactionRef}/verify`, {
            headers: {
                Authorization: `Bearer ${flutterwaveSecretKey}`,
            },
        });

        const { status1: resStatus, data } = res.data;

        if (resStatus === 'success') {
            const { amount, currency, status: paymentStatus } = data;

            if (paymentStatus === 'successful') {
                // Update user's balance
                const user = await User.findById(userId);

                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }

                user.acctBal += amount;  // Assuming the amount is in the same currency as the user's balance
                await user.save();

                // Log the transaction in the database
                const transaction = new Transaction({
                    user: userId,
                    amount,
                    type: 'credit',  // Assuming this is a credit transaction
                    status: 'successful',
                    flutterwaveRef: transactionRef,
                });
                await transaction.save();

                return res.status(200).json({ message: 'Payment verified and balance updated', balance: user.acctBal });
            } else {
                return res.status(400).json({ message: 'Payment verification failed', status: paymentStatus });
            }
        } else {
            return res.status(400).json({ message: 'Payment verification failed', status });
        }

    } catch (error) {
        handle500Errors(error, res)
    }
}




export const debitAccount = async (req:Request, res: Response): Promise<void> => {
    try {
        
    } catch (error) {
        handle500Errors(error, res)
    }
}


export const getAccountHistory = async (req:Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const history = await Account.find({ user: userId }).sort({ createdAt: -1 });

        if(!history || history.length === 0){
            res.status(404).json({ message: 'No transaction found for user' });
            return;
        }

        res.status(200).json(history);
    } catch (error) {
        handle500Errors(error, res)
    }
}
