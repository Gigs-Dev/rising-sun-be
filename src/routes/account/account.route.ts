import { creditAccount, debitAccount, getAccountHistory } from "../../controller/payment/transaction.controller";
import { Router } from "express";

const router = Router();

router.route('/credit/:userId').post(creditAccount);

router.route('/debit/:userId').post(debitAccount);

router.route('/:userId').get(getAccountHistory)


export default router;
