import { Router } from "express";
import { verifyAdminToken } from "../../middleware/verifyToken";
import { approveWithdrawal, rejectWithdrawal } from "../../controllers/admin/admin.transaction.controller";

const adminRouter = Router()

adminRouter.post('/withdrawals/:id/approve', verifyAdminToken, approveWithdrawal);

adminRouter.post('/withdrawals/:id/reject', verifyAdminToken, rejectWithdrawal)


export default adminRouter;
