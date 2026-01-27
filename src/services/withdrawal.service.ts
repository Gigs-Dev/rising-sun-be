import { Types, startSession } from "mongoose";
import { AccountTransaction } from "../models/transaction.model";
import { API_URL, FLW_PUBLIC_KEY, FLW_SECRET_KEY } from "../config/env.config";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";


const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);



export class DebitTransactionService {

  static async approveAndSend(transactionId: string, adminId: string) {
    const session = await startSession();
    session.startTransaction();

    try {
      const transaction = await AccountTransaction.findById({ _id: transactionId, status: "pending" }, { new: true, session },)

      if(!transaction || transaction.status !== 'pending'){
        throw new AppError('Transaction already processed or does not exist', HttpStatus.BAD_REQUEST);
      }

      const flwResponse = await flw.Transfer.initiate({
          account_bank: transaction.meta.bankCode,
          account_number: transaction.meta.acctNum,
          amount: transaction.amount,
          currency: "NGN",
          narration: "User withdrawal",
          reference: transaction.reference,
          callback_url: `${API_URL}webhooks/flutterwave`,
        })

      if(flwResponse.data.status === 'success'){
        await AccountTransaction.findByIdAndUpdate({
          _id: transactionId }, {
            $set: {
              approvedBy: new Types.ObjectId(adminId),
              reference: flwResponse.data.reference
            }
          }
        )
      }
    } catch (error) {
      throw new Error(error)
    }

  }

}


