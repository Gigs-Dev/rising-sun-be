import { Router } from "express";

import { getReferals, creditReferer, singleUser } from "../../controller/user/user.controller";
import { verifyToken } from "../../util/verifyJwt";


const router = Router();

router.route('/referrals/:referalId').get(verifyToken, getReferals);

router.patch('/', verifyToken, creditReferer);

router.get('/:id', verifyToken, singleUser )

export default router;
