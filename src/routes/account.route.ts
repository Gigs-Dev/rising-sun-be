import { Router } from "express";
import { getAccount, getAllBanks, updateAccount, verifyWithdrawalPin } from "../controllers/account.controller";
import { verifyUserToken } from "../middleware/verifyToken";


const accountRouter = Router();

accountRouter.patch('/', verifyUserToken,  updateAccount);

accountRouter.get('/', verifyUserToken,  getAccount);

accountRouter.patch('/:userId/withdrawal-pin', verifyUserToken,  verifyWithdrawalPin);

accountRouter.get('/getAllBanks', verifyUserToken,  getAllBanks);

export default accountRouter;
