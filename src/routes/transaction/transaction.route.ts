import { Router } from "express";
import { transactionHistory, withdrawal, verify } from '../../controller/payment/transaction';
const router = Router();

router.route('/:userId').get(transactionHistory);

router.route('/credit').get(verify);

router.route('/withdraw').post(withdrawal);


export default router;
