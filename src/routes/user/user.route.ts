import { Router } from "express";

import { getReferals, singleUser } from "../../controller/user/user.controller";
import { verifyToken } from "../../util/verifyJwt";


const router = Router();

router.route('/referrals/:referalId').get(verifyToken, getReferals);

router.get('/:id', verifyToken, singleUser )

export default router;
