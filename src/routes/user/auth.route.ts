import { Router } from 'express';

import { sendOtp, newUser, login } from '../../controller/user/auth.controller';

const router = Router()

router.post('/sendotp', sendOtp);
router.post('/newuser', newUser);
router.post('/session', login);


export default router;
