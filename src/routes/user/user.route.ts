import { Router } from "express";

import { getReferals, creditReferer } from "../../controller/user/user.controller";
import { verifyToken } from "../../util/verifyJwt";


const router = Router();

router.route('/referrals/:referalId').get(verifyToken, getReferals);

router.patch('/', verifyToken, creditReferer);

export default router;
