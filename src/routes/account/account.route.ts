import { creditAccount, debitAccount, verifyCredit, verifyDebit, getAccountHistory } from "../../controller/account/transaction.controller";
import { Router } from "express";

const router = Router();

router.route('/credit').post(creditAccount);

router.route('/credit/verify').post(verifyCredit);

router.route('/debit').post(debitAccount);

router.route('/debit/verify').post(verifyDebit);

router.route('/:userId').get(getAccountHistory)


export default router;
