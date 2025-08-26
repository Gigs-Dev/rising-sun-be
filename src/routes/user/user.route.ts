import { Router } from "express";

import { getReferals, singleUser } from "../../controller/user/user.controller";
import { verifyToken } from "../../util/verifyJwt";


const router = Router();

router.get('/referrals/:referalId', verifyToken, getReferals);

router.get('/:id', verifyToken, singleUser )

export default router;
