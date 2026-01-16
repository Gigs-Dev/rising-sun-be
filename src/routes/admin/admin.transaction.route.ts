import { Router } from "express";
import { verifyAdminToken } from "../../middleware/verifyToken";
import {  approveAndSendWithdrawal, rejectWithdrawal, getUserWithdrawalHistory } from "../../controllers/admin/admin.transaction.controller";
import { authorizeAdmin } from "../../middleware/auth.middleware";


const adminRouter = Router()

adminRouter.patch('/transactions/:id/approve', verifyAdminToken, authorizeAdmin,  approveAndSendWithdrawal);

adminRouter.patch('/transactions/:id/reject', verifyAdminToken, authorizeAdmin, rejectWithdrawal)

adminRouter.get('/transactions/:userId', verifyAdminToken, authorizeAdmin, getUserWithdrawalHistory);


export default adminRouter;
