
import { Router } from "express";
import { paymentHistory, verifyAcctNumber, verifyTransaction } from "../../controller/payment/payments.controller";
import { verifyToken } from "../../util/verifyJwt";
const router = Router();


router.post('/verify-account-number', verifyToken, verifyAcctNumber);

router.post('/verify-transaction', verifyToken, verifyTransaction);

router.get('/:userId', verifyToken,  paymentHistory)

export default router;
