import { Router } from "express";
import { creditTransaction, debitTransaction, transactionHistory } from "../controllers/transaction.controller";
import { verifyUserToken } from "../middleware/verifyToken";

const transactionRouter = Router();

transactionRouter.post('/credit', verifyUserToken, creditTransaction);


transactionRouter.post('/debit', verifyUserToken, debitTransaction);

transactionRouter.get('/:userId', verifyUserToken, transactionHistory);


export default transactionRouter;
