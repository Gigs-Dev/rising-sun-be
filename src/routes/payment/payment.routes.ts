
import { Router } from "express";
import { paymentHistory, verifyAcctNumber, verifyTransaction } from "../../controller/payment/payments.controller";
import { verifyToken } from "../../util/verifyJwt";
const router = Router();


router.post('/verify-account-number', verifyAcctNumber);

router.post('/verify-transaction', verifyTransaction);

router.get('/:userId', paymentHistory)

export default router;
