import { Router } from "express";
import { creditTransaction, requestWithdrawal, transactionHistory } from "../controllers/transaction.controller";
import { verifyUserToken } from "../middleware/verifyToken";

const transactionRouter = Router();

transactionRouter.post('/credit', verifyUserToken, creditTransaction);

transactionRouter.post('/withdrawal-request', verifyUserToken, requestWithdrawal);

transactionRouter.get('/:userId', verifyUserToken, transactionHistory);


export default transactionRouter;
