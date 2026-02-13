import { Types, startSession } from 'mongoose';
import { AccountTransaction } from '../models/transaction.model';
import { API_URL, FLW_PUBLIC_KEY, FLW_SECRET_KEY } from '../config/env.config';
import { AppError } from '../utils/app-error';
import { HttpStatus } from '../constants/http-status';

const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);


export class DebitTransactionService {
  static async approveAndSend(transactionId: string, adminId: string) {
    if (!Types.ObjectId.isValid(transactionId)) {
      throw new AppError('Invalid transaction ID', HttpStatus.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(adminId)) {
      throw new AppError('Invalid admin ID', HttpStatus.BAD_REQUEST);
    }

    const session = await startSession();
    let sessionActive = false;

    try {
      /* -------------------- 1️⃣ Lock Transaction -------------------- */
      session.startTransaction();
      sessionActive = true;

      const transaction = await AccountTransaction.findOneAndUpdate(
        { _id: transactionId, status: 'pending' },
        { $set: { status: 'processing' } },
        { new: true, session }
      );

      if (!transaction) {
        throw new AppError(
          'Transaction already processed or does not exist',
          HttpStatus.CONFLICT_REQUEST
        );
      }

      await session.commitTransaction();
      session.endSession();
      sessionActive = false;

      /* -------------------- 2️⃣ Call Flutterwave -------------------- */
      const flwResponse = await flw.Transfer.initiate({
        account_bank: transaction.meta.bankCode,
        account_number: transaction.meta.acctNum,
        amount: transaction.amount,
        currency: 'NGN',
        narration: 'User withdrawal',
        reference: transaction.reference, // 🔒 immutable internal reference
        // callback_url: `${API_URL}/webhooks/flutterwave`,
      });

      /* -------------------- 3️⃣ Flutterwave Accepted -------------------- */
      if (flwResponse?.data?.status === 'success') {
        return await AccountTransaction.findByIdAndUpdate(
          transactionId,
          {
            $set: {
              status: 'queued', // ✅ wait for webhook
              approvedBy: new Types.ObjectId(adminId),
              meta: {
                ...transaction.meta,
                flwReference: flwResponse.data.reference,
                fee: flwResponse.data.fee,
              },
            },
          },
          { new: true }
        );
      }

      /* -------------------- 4️⃣ Explicit Failure Handling -------------------- */
      await AccountTransaction.findByIdAndUpdate(transactionId, {
        $set: {
          status: 'failed',
          meta: {
            ...transaction.meta,
            failureReason: flwResponse?.message || 'Flutterwave transfer failed',
          },
        },
      });

      throw new AppError(
        'Transfer request rejected by payment gateway',
        HttpStatus.SERVICE_UNAVAILABLE
      );

    } catch (error: any) {
      if (sessionActive) {
        await session.abortTransaction();
        session.endSession();
      }

      if (error instanceof AppError) throw error;

      throw new AppError(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
