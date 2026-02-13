import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AccountTransaction } from '../models/transaction.model';
import { FLW_SECRET_KEY } from '../config/env.config';

/* -------------------- Signature Verification -------------------- */
/**
 * Flutterwave sends `verif-hash` header.
 * You DO NOT hash the body.
 */
const verifyFlutterwaveSignature = (req: Request): boolean => {
  const signature = req.headers['verif-hash'];
  return signature === FLW_SECRET_KEY;
};

/* -------------------- Unified Webhook -------------------- */
export const flutterwaveWebhook = async (req: Request, res: Response) => {
  if (!verifyFlutterwaveSignature(req)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Flutterwave signature',
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payload = req.body?.data;
    if (!payload) {
      await session.commitTransaction();
      return res.status(200).json({ success: true });
    }

    const normalizedStatus = payload.status?.toLowerCase();

    /* ============================================================
     * CREDIT TRANSACTION (Card / Bank Deposit)
     * ============================================================ */
    if (payload.tx_ref) {
      const reference = payload.tx_ref;

      const transaction = await AccountTransaction.findOne({
        reference,
        type: 'credit',
      }).session(session);

      // Unknown or already handled → acknowledge
      if (!transaction || transaction.status === 'successful') {
        await session.commitTransaction();
        return res.status(200).json({ success: true });
      }

      if (normalizedStatus === 'successful') {
        transaction.status = 'successful';
        transaction.meta = {
          ...transaction.meta,
          flwTransactionId: payload.id,
          flwCreatedAt: payload.created_at,
          paymentType: payload.payment_type,
        };

        await transaction.save({ session });
      }

      await session.commitTransaction();
      return res.status(200).json({ success: true });
    }

    /* ============================================================
     * DEBIT TRANSACTION (Withdrawal / Transfer)
     * ============================================================ */
    if (payload.reference) {
      const reference = payload.reference;

      const transaction = await AccountTransaction.findOne({
        reference,
        type: 'debit',
      }).session(session);

      // Unknown or finalized → acknowledge
      if (!transaction || ['successful', 'failed'].includes(transaction.status)) {
        await session.commitTransaction();
        return res.status(200).json({ success: true });
      }

      if (normalizedStatus === 'successful') {
        transaction.status = 'successful';
        transaction.meta = {
          ...transaction.meta,
          flwTransferId: payload.id,
          completedAt: payload.created_at,
        };
      } else {
        transaction.status = 'failed';
        transaction.meta = {
          ...transaction.meta,
          flwTransferId: payload.id,
          failureReason:
            payload.complete_message || 'Flutterwave transfer failed',
        };
      }

      await transaction.save({ session });
      await session.commitTransaction();
      return res.status(200).json({ success: true });
    }

    /* -------------------- Unhandled Event -------------------- */
    await session.commitTransaction();
    return res.status(200).json({ success: true });

  } catch (error) {
    await session.abortTransaction();
    console.error('FLUTTERWAVE WEBHOOK ERROR:', error);

    // IMPORTANT: Still return 200 to stop retries
    return res.status(200).json({ success: true });
  } finally {
    session.endSession();
  }
};
