import { Types, startSession } from "mongoose";
import Withdrawal from "../models/admin/withdrawal";
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
            }
          }
        )
      }
    } catch (error) {
      
    }

  }

}


// export class DebitTransactionService {
//   static async approveAndSend(withdrawalId: string, adminId: string) {
//     const session = await startSession();
//     session.startTransaction();

//     try {
//       /**
//        * 1️⃣ ATOMIC LOCK
//        * Only ONE request can move PENDING → PROCESSING
//        */
//       const withdrawal = await AccountTransaction.findOneAndUpdate(
//         { _id: withdrawalId, status: "PENDING" },
//         {
//           $set: {
//             status: "PROCESSING",
//             approvedBy: new Types.ObjectId(adminId),
//           },
//         },
//         { new: true, session }
//       );

//       if (!withdrawal) {
//         /**
//          * Retry-safe behavior:
//          * - Already PROCESSING
//          * - Already SENT / SUCCESS
//          * - Already FAILED
//          */
//         const existing = await Withdrawal.findById(withdrawalId);

//         if (!existing) {
//           throw new Error("Withdrawal not found");
//         }

//         if (existing.status === "PROCESSING") {
//           return {
//             status: "PROCESSING",
//             message: "Withdrawal is already being processed",
//             withdrawal: existing,
//           };
//         }

//         if (existing.status === "SENT" || existing.status === "SUCCESS") {
//           return {
//             status: existing.status,
//             message: "Withdrawal already initiated",
//             withdrawal: existing,
//           };
//         }

//         if (existing.status === "FAILED") {
//           throw new Error("Withdrawal previously failed. Manual retry required.");
//         }

//         throw new Error("Withdrawal cannot be processed");
//       }

//       /**
//        * 2️⃣ RETRY-SAFE CHECK
//        * If Flutterwave transferId already exists,
//        * do NOT resend payout
//        */
//       if (withdrawal.flutterwave?.transferId) {
//         await session.commitTransaction();
//         session.endSession();

//         return {
//           status: "SENT",
//           message: "Withdrawal already sent",
//           withdrawal,
//         };
//       }

//       /**
//        * 3️⃣ SEND PAYOUT
//        */
//       const flwResponse = await flw.Transfer.initiate({
//           account_bank: withdrawal.bankSnapshot.bankCode,
//           account_number: withdrawal.bankSnapshot.acctNum,
//           amount: withdrawal.amount,
//           currency: "NGN",
//           narration: "User withdrawal",
//           reference: withdrawal.reference,
//           callback_url: `${process.env.API_URL}/webhooks/flutterwave`,
//         },
//         {
//           headers: {
//             // Optional but recommended
//             "Idempotency-Key": withdrawal.reference,
//           },
//         }
//       );

//       const data = flwResponse?.data?.data;
//       if (!data) throw new Error("Invalid Flutterwave response");

//       if(flwResponse?.status === 'success' && flwResponse?.data?.status === 'NEW'){
//         withdrawal.status === 'APPROVED'

//         /**
//          * 4️⃣ SAVE PAYOUT METADATA
//          */
//         withdrawal.flutterwave = {
//           transferId: data.id,
//           response: flwResponse.data,
//         };
  
//         await withdrawal.save({ session });
  
//         /**
//          * 5️⃣ CREATE TRANSACTION (IDEMPOTENT)
//          * Prevent duplicates using reference
//          */
//         await AccountTransaction.updateOne(
//           { reference: data.tx_ref },
//           {
//             $setOnInsert: {
//               userId: withdrawal.userId,
//               accountId: withdrawal.accountId,
//               type: "debit",
//               source: "withdrawal",
//               amount: data.amount,
//               currency: data.currency,
//               status: data.status,
//               payment_type: data.payment_type,
//               meta: {
//                 bankName: data.meta?.bankname,
//                 originatorName: data.meta?.originatorname,
//               },
//             },
//           },
//           { upsert: true, session }
//         );

//         await session.commitTransaction();
//         session.endSession();
  
//         return {
//           message: "Withdrawal approved and payout initiated",
//           withdrawal,
//         };

//       } else {
//         return {
//           message: "Something went wrong",
//         }
//       }


//     } catch (error) {
//       await session.abortTransaction();
//       session.endSession();

//       /**
//        * 6️⃣ SAFE FAILURE STATE
//        * Only revert if still PROCESSING
//        */
//       await Withdrawal.updateOne(
//         { _id: withdrawalId, status: "PROCESSING" },
//         { $set: { status: "FAILED" } }
//       );

//       throw error;
//     }
//   }
// }
