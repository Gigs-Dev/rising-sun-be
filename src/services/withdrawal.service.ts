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
        status: { $in: ['pending', 'processing'] }, // allow retry
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

    /* -------------------- 3️⃣ Validate Transaction Data -------------------- */
    if (!transaction.meta?.bankCode || !transaction.meta?.accountNumber) {
      await AccountTransaction.findByIdAndUpdate(transactionId, {
        $set: {
          status: 'failed',
          'meta.failureReason': 'Invalid bank details',
        },
      });

      throw new AppError('Invalid bank details', HttpStatus.BAD_REQUEST);
    }

    if (transaction.amount <= 0) {
      throw new AppError('Invalid transaction amount', HttpStatus.BAD_REQUEST);
    }

    /* -------------------- 4️⃣ Call Flutterwave -------------------- */
    let flwResponse: any;

    try {
      flwResponse = await flw.Transfer.initiate({
        account_bank: transaction.meta.bankCode,
        account_number: transaction.meta.accountNumber.toString(),
        amount: transaction.amount,
        currency: transaction.currency,
        narration: 'User withdrawal',
        reference: `${transaction.reference}-${Date.now()}`, // unique
        callback_url: `${CALLBACK_URL}requests`,
      });
    } catch (error: any) {
      await AccountTransaction.findByIdAndUpdate(transactionId, {
        $set: {
          status: 'failed',
          'meta.failureReason':
            error?.message || 'Flutterwave network error',
        },
      });

      throw new AppError(
        'Payment gateway unavailable',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    /* -------------------- 5️⃣ FIXED: Correct Status Handling -------------------- */
    const apiStatus = flwResponse?.status;        // API request result
    const transferStatus = flwResponse?.data?.status; // NEW | PENDING | SUCCESSFUL

    if (apiStatus === 'success') {
      // Transfer successfully queued or processing
      return await AccountTransaction.findByIdAndUpdate(
        transactionId,
        {
          $set: {
            status: 'queued', // wait for webhook
            'meta.flwReference': flwResponse.data.reference,
            'meta.fee': flwResponse.data.fee,
            'meta.transferStatus': transferStatus,
          },
        },
        { new: true }
      );
    }

    /* -------------------- 6️⃣ Explicit API Failure -------------------- */
    await AccountTransaction.findByIdAndUpdate(transactionId, {
      $set: {
        status: 'failed',
        'meta.failureReason':
          flwResponse?.message || 'Flutterwave transfer rejected',
      },
    });

    throw new AppError(
      flwResponse?.message || 'Transfer request rejected by payment gateway',
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }
}
