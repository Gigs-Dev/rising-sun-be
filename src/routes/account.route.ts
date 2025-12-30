import { Router } from "express";
import { updateAccount } from "../controllers/account.controller";

const accountRouter = Router();

accountRouter.put('/:accountId', updateAccount);

export default accountRouter;
