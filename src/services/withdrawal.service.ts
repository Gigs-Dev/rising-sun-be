import { Types, startSession } from "mongoose";
import Withdrawal from "../models/admin/withdrawal";
import { AccountTransaction } from "../models/transaction.model";
import flutterwave from "../utils/flutterwave";

export class WithdrawalService {
  static async approveAndSend(withdrawalId: string, adminId: string) {
    const session = await startSession();
    session.startTransaction();

    try {
      /**
       * 1️⃣ ATOMIC LOCK
       * Only ONE request can move PENDING → PROCESSING
       */
      const withdrawal = await Withdrawal.findOneAndUpdate(
        { _id: withdrawalId, status: "PENDING" },
        {
          $set: {
            status: "PROCESSING",
            approvedBy: new Types.ObjectId(adminId),
          },
        },
        { new: true, session }
      );

      if (!withdrawal) {
        /**
         * Retry-safe behavior:
         * - Already PROCESSING
         * - Already SENT / SUCCESS
         * - Already FAILED
         */
        const existing = await Withdrawal.findById(withdrawalId);

        if (!existing) {
          throw new Error("Withdrawal not found");
        }

        if (existing.status === "PROCESSING") {
          return {
            status: "PROCESSING",
            message: "Withdrawal is already being processed",
            withdrawal: existing,
          };
        }

        if (existing.status === "SENT" || existing.status === "SUCCESS") {
          return {
            status: existing.status,
            message: "Withdrawal already initiated",
            withdrawal: existing,
          };
        }

        if (existing.status === "FAILED") {
          throw new Error("Withdrawal previously failed. Manual retry required.");
        }

        throw new Error("Withdrawal cannot be processed");
      }

      /**
       * 2️⃣ RETRY-SAFE CHECK
       * If Flutterwave transferId already exists,
       * do NOT resend payout
       */
      if (withdrawal.flutterwave?.transferId) {
        await session.commitTransaction();
        session.endSession();

        return {
          status: "SENT",
          message: "Withdrawal already sent",
          withdrawal,
        };
      }

      /**
       * 3️⃣ SEND PAYOUT
       */
      const flwResponse = await flutterwave.post(
        "/transfers",
        {
          account_bank: withdrawal.bankSnapshot.bankCode,
          account_number: withdrawal.bankSnapshot.acctNum,
          amount: withdrawal.amount,
          currency: "NGN",
          narration: "User withdrawal",
          reference: withdrawal.reference,
          callback_url: `${process.env.API_URL}/webhooks/flutterwave`,
        },
        {
          headers: {
            // Optional but recommended
            "Idempotency-Key": withdrawal.reference,
          },
        }
      );

      const data = flwResponse?.data?.data;
      if (!data) throw new Error("Invalid Flutterwave response");

      /**
       * 4️⃣ SAVE PAYOUT METADATA
       */
      withdrawal.status = "SENT";
      withdrawal.flutterwave = {
        transferId: data.id,
        response: flwResponse.data,
      };

      await withdrawal.save({ session });

      /**
       * 5️⃣ CREATE TRANSACTION (IDEMPOTENT)
       * Prevent duplicates using reference
       */
      await AccountTransaction.updateOne(
        { reference: data.tx_ref },
        {
          $setOnInsert: {
            userId: withdrawal.userId,
            accountId: withdrawal.accountId,
            type: "debit",
            source: "withdrawal",
            amount: data.amount,
            currency: data.currency,
            status: data.status,
            payment_type: data.payment_type,
            meta: {
              bankName: data.meta?.bankname,
              originatorName: data.meta?.originatorname,
            },
          },
        },
        { upsert: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        status: "SENT",
        message: "Withdrawal approved and payout initiated",
        withdrawal,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      /**
       * 6️⃣ SAFE FAILURE STATE
       * Only revert if still PROCESSING
       */
      await Withdrawal.updateOne(
        { _id: withdrawalId, status: "PROCESSING" },
        { $set: { status: "FAILED" } }
      );

      throw error;
    }
  }
}
