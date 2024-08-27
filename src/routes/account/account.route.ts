import { creditAccount, debitAccount, getAccountHistory } from "../../controller/account/transaction.controller";
import { Router } from "express";

const router = Router();

router.route('/credit').post(creditAccount);

router.route('/debit').post(debitAccount);

router.route('/:userId').get(getAccountHistory)


export default router;
