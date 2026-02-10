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

    try {
      session.startTransaction();

      // 1️⃣ Lock transaction early
      const transaction = await AccountTransaction.findOneAndUpdate(
        { _id: transactionId, status: 'pending' },
        { $set: { status: 'processing' } },
        { new: true, session }
      );

      if (!transaction) {
        throw new AppError(
          'Transaction already processed or does not exist',
          HttpStatus.BAD_REQUEST
        );
      }

      await session.commitTransaction();
      session.endSession();

      // 2️⃣ Call Flutterwave OUTSIDE transaction
      const flwResponse = await flw.Transfer.initiate({
        account_bank: transaction.meta.bankCode,
        account_number: transaction.meta.acctNum,
        amount: transaction.amount,
        currency: "NGN",
        narration: "User withdrawal",
        reference: transaction.reference,
        callback_url: `${API_URL}webhooks/flutterwave`,
      });

      // 3️⃣ Update result
      if (flwResponse?.data?.status === 'success') {
        const updated = await AccountTransaction.findByIdAndUpdate(
          transactionId,
          {
            $set: {
              status: 'successful',
              approvedBy: new Types.ObjectId(adminId),
              reference: flwResponse.data.reference,
              meta: {
                bankName: flwResponse.data.bank_name,
                accountNumber: flwResponse.data.account_number,
                fullName: flwResponse.data.full_name,
                fee: flwResponse.data.fee,
              },
            },
          },
          { new: true }
        );

        return updated;
      }

      // Mark as failed if Flutterwave fails
      await AccountTransaction.findByIdAndUpdate(transactionId, {
        $set: { status: 'failed' },
      });

      throw new AppError(
        'Transfer failed on payment gateway',
        HttpStatus.BAD_REQUEST
      );

    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      if (error instanceof AppError) throw error;
      throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}


