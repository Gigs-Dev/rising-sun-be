import { Router } from "express";
import { verifyUserToken } from "../../middleware/verifyToken";
import {  approveAndSendWithdrawal, rejectWithdrawal, getAllTransactionsAdmin} from "../../controllers/admin/admin.transaction.controller";
import { authorizeAdmin } from "../../middleware/auth.middleware";


const adminRouter = Router()

adminRouter.patch('/transactions/:id/approve', verifyUserToken, authorizeAdmin, approveAndSendWithdrawal);

adminRouter.patch('/transactions/:id/reject', verifyUserToken, authorizeAdmin, rejectWithdrawal)

adminRouter.get('/transactions', verifyUserToken, authorizeAdmin, getAllTransactionsAdmin);


export default adminRouter;
