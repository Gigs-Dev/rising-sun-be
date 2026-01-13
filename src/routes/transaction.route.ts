import { Router } from "express";
import { creditTransaction, debitTransaction, getMyWithdrawalHistory, requestWithdrawal, transactionHistory } from "../controllers/transaction.controller";
import { verifyUserToken } from "../middleware/verifyToken";

const transactionRouter = Router();

transactionRouter.post('/credit', verifyUserToken, creditTransaction);

transactionRouter.post('/withdrawal-request', verifyUserToken, requestWithdrawal);

transactionRouter.get('/:userId', verifyUserToken, transactionHistory);

transactionRouter.get('/withdrawal/:userId', verifyUserToken, getMyWithdrawalHistory);


export default transactionRouter;
