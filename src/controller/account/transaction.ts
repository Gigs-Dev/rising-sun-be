import { Response, Request } from "express";
import Transaction from '../../model/account.model';
import User from "../../model/user.model";
import { handle500Errors } from "../../util/api-response";



const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

const generateUniqueReference = () => {
    const timestamp = Date.now()
    const randomSuffix = Math.floor(Math.random() * 10000)
    return `txn_${timestamp}_${randomSuffix}`
}



export const verify = async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
        const transactionDetails = await Transaction.findOne({ ref: req.query.tx_ref });
        if(!transactionDetails){
            res.status(400).json({ msg: 'An unexpected error occured'})
            return;
        }
        const response = await flw.Transaction.verify({ id: req.query.transaction_id });

        if(response.data.status === "successful"
            && response.data.amount === transactionDetails.amount
            && response.data.currency === "NGN") {
                const user = await User.findById(userId);
                if(!user){
                    res.status(404).json({ msg: 'User not found' });
                    return;
                }
                const { amount, tx_ref } = response.data;
                if (typeof user.acctBal !== 'number') {
                    user.acctBal = 0;
                }
                user.acctBal += amount;

                await user.save()

                const transaction = new Transaction({
                    user: userId,
                    amount,
                    type: 'credit',
                    ref: tx_ref
                })

                await transaction.save();

                res.status(200).json({ msg: 'Transaction successdul', transaction: transaction })
            } else {
                res.status(400).json({ msg: 'Transaction Failed, please try again later'})
            }

    } catch (error) {
        handle500Errors(error, res);
    }
}



export const withdrawal = async (req: Request, res: Response) => {
    const { amount, userId, account_bank, account_number } = req.body;

    if (!amount || !userId || !account_bank || !account_number) {
        return res.status(400).json({ msg: 'Missing required fields' });
    }
    try {
        
        const user = await User.findById(userId);
        if(!user){
            res.status(403).json({ msg: 'Transaction Failed, please try again later'});
            return;
        }
        
        if(user.acctBal < amount){
            res.status(403).json({ msg: 'Insufficient balance'});
            return;
        }
        
        const details = {
            ...req.body,
            reference: generateUniqueReference()
        }

       const response = await flw.Transfer.initiate(details);

       if(response.status === 'success'){
           user.acctBal -= amount;

           const transaction = new Transaction({
               user: userId,
               full_name: response.data.full_name,
               amount: response.data.amount,
               type: 'debit',
               currency: response.data.currency,
               account_bank: response.data.bank_name,
               account_number: response.data.account_number,
               fee: response.data.fee,
               ref: response.data.reference
           })

           await Promise.all([user.save(), transaction.save()]);

        //    await user.save();
        //    await transaction.save();

           return res.status(200).json({user: user, transaction: transaction})
        } else {
            return res.status(400).json({ msg: 'Withdrawal failed, please try again later', error: response.message });
        }

    } catch (error) {
        handle500Errors(error, res);
    }
}


export const transactionHistory = async (req:Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const history = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

        if(!history || history.length === 0){
            res.status(404).json({ message: 'No transaction found for user' });
            return;
        }

        res.status(200).json(history);
    } catch (error) {
        handle500Errors(error, res)
    }
}
