import axios from 'axios';
import User from '../../model/user.model';
import { Request } from 'express';


const Flutterwave = require('flutterwave-node-v3')


interface Itransaction {
    transactionRef: string;
    userId: string;
}

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

export const baseAxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer `,
    },
})

export async function payment(transaction: Itransaction){

    const { transactionRef, userId } = transaction;

    try {
        const res = await axios.get(`https://api.flutterwave.com/v3/transactions/${transactionRef}/verify`);

        const { status,  data} = res.data;

        if(status === 'success'){
            const { amount, currency, status: paymentStatus } = data;

            if(paymentStatus === 'successful'){
                const user = await User.findById(userId);

                if(!user){
                    throw new Error('User not found');
                    return;
                }

                user.acctBal += amount;

                await user.save();

            }
        }


    } catch (error) {
        throw new Error();
    }

}


// export const verify = (req: Request, res: Response) => {
//     if (req.query.status === 'successful') {
//         const transactionDetails = await Transaction.find({ref: req.query.tx_ref});
//         const response = await flw.Transaction.verify({id: req.query.transaction_id});
//         if (
//             response.data.status === "successful"
//             && response.data.amount === transactionDetails.amount
//             && response.data.currency === "NGN") {
//             // Success! Confirm the customer's payment
//         } else {
//             // Inform the customer their payment was unsuccessful
//         }
// }


// const Flutterwave = require('flutterwave-node-v3');
// const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
// flw.Transaction.verify({ id: transactionId })
//     .then((response) => {
//         if (
//             response.data.status === "successful"
//             && response.data.amount === expectedAmount
//             && response.data.currency === expectedCurrency) {
//             // Success! Confirm the customer's payment
//         } else {
//             // Inform the customer their payment was unsuccessful
//         }
//     })
//     .catch(console.log);
