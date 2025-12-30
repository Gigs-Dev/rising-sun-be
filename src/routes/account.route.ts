import { Router } from "express";
import { getAccount, updateAccount } from "../controllers/account.controller";
import { verifyUserToken } from "../middleware/verifyToken";
import { authorizeUser } from "../middleware/auth.middleware";

const accountRouter = Router();

accountRouter.patch('/', verifyUserToken,  updateAccount);

accountRouter.get('/', verifyUserToken,  getAccount);

export default accountRouter;
