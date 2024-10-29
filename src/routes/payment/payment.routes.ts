// const {  }
import { Router } from "express";
import { verifyAcctNumber, verifyTransaction } from "../../controller/payment/payments.controller";
import { verifyToken } from "../../util/verifyJwt";
const router = Router();


router.post('verify-account-number', verifyToken, verifyAcctNumber);

router.post('verify-transaction', verifyToken, verifyTransaction);

export default router;
