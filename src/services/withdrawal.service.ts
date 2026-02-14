import { Types } from 'mongoose';
import { AccountTransaction } from '../models/transaction.model';
import { CALLBACK_URL, FLW_PUBLIC_KEY, FLW_SECRET_KEY } from '../config/env.config';
import { AppError } from '../utils/app-error';
import { HttpStatus } from '../constants/http-status';

const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);

export class DebitTransactionService {
  static async approveAndSend(transactionId: string, adminId: string) {
    /* -------------------- 1️⃣ Validate IDs -------------------- */
    if (!Types.ObjectId.isValid(transactionId)) {
      throw new AppError('Invalid transaction ID', HttpStatus.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(adminId)) {
      throw new AppError('Invalid admin ID', HttpStatus.BAD_REQUEST);
    }

    /* -------------------- 2️⃣ Lock Transaction -------------------- */
    const transaction = await AccountTransaction.findOneAndUpdate(
      {
        _id: transactionId,
        status: { $in: ['pending', 'processing'] }, // ✅ allow retry
      },
      {
        $set: {
          status: 'processing',
          approvedBy: new Types.ObjectId(adminId),
        },
      },
      { new: true }
    );

    if (!transaction) {
      throw new AppError(
        'Transaction cannot be processed or already completed',
        HttpStatus.CONFLICT_REQUEST
      );
    }

    /* -------------------- 3️⃣ Validate Bank Meta -------------------- */
    if (!transaction.meta?.bankCode || !transaction.meta?.accountNumber) {
      await AccountTransaction.findByIdAndUpdate(transactionId, {
        $set: {
          status: 'failed',
          meta: {
            ...transaction.meta,
            failureReason: 'Invalid bank details',
          },
        },
      });

      throw new AppError('Invalid bank details', HttpStatus.BAD_REQUEST);
    }

    /* -------------------- 4️⃣ Call Flutterwave -------------------- */
    let flwResponse: any;

    try {
      flwResponse = await flw.Transfer.initiate({
        account_bank: transaction.meta.bankCode,
        account_number: transaction.meta.accountNumber,
        amount: transaction.amount,
        currency: transaction.currency,
        narration: 'User withdrawal',
        reference: transaction.reference, // 🔒 immutable internal ref
        callback_url: `${CALLBACK_URL}requests`,
      });
    } catch (error: any) {
      console.log('ERROR:', error)
      await AccountTransaction.findByIdAndUpdate(transactionId, {
        $set: {
          status: 'failed',
          meta: {
            ...transaction.meta,
            failureReason: error.message || 'Flutterwave network error',
          },
        },
      });

      throw new AppError(
        'Payment gateway unavailable',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    /* -------------------- 5️⃣ Handle Gateway Response -------------------- */
    const flwStatus = flwResponse?.data?.status;

    if (['success', 'pending'].includes(flwStatus)) {
      return await AccountTransaction.findByIdAndUpdate(
        transactionId,
        {
          $set: {
            status: 'queued', // ⏳ wait for webhook
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

    /* -------------------- 6️⃣ Explicit Rejection -------------------- */
    await AccountTransaction.findByIdAndUpdate(transactionId, {
      $set: {
        status: 'failed',
        meta: {
          ...transaction.meta,
          failureReason:
            flwResponse?.message || 'Flutterwave transfer rejected',
        },
      },
    });

    throw new AppError(
      'Transfer request rejected by payment gateway',
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }
}
