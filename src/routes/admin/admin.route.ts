import { Router } from "express";
import { verifyAdminToken } from "../../middleware/verifyToken";
import {  approveAndSendWithdrawal, rejectWithdrawal } from "../../controllers/admin/admin.transaction.controller";
import { authorizeAdmin } from "../../middleware/auth.middleware";

const adminRouter = Router()

adminRouter.post('/withdrawals/:id/approve', verifyAdminToken, authorizeAdmin,  approveAndSendWithdrawal);

adminRouter.post('/withdrawals/:id/reject', verifyAdminToken, authorizeAdmin, rejectWithdrawal)


export default adminRouter;
