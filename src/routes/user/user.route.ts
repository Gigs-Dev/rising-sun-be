import { Router } from "express";

import { getReferals, creditReferer } from "../../controller/user/user.controller";
import { verifyUser } from "../../util/verifyJwt";


const router = Router();

router.route('/referrals/:referalId').get(verifyUser, getReferals);

router.patch('/', creditReferer);

export default router;
