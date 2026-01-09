import { Router } from "express";
import { getAccount, updateAccount, updateWithdrawalPin } from "../controllers/account.controller";
import { verifyUserToken } from "../middleware/verifyToken";


const accountRouter = Router();

accountRouter.patch('/', verifyUserToken,  updateAccount);

accountRouter.get('/', verifyUserToken,  getAccount);

accountRouter.patch('/withdrawal-pin', verifyUserToken,  updateWithdrawalPin);

export default accountRouter;
