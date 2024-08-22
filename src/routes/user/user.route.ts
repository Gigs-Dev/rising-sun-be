import { Router } from "express";

import { getReferals, creditReferer } from "../../controller/user/user.controller";


const router = Router();

router.get('/referrals/:referalId', getReferals);

router.patch('/', creditReferer);

export default router;
