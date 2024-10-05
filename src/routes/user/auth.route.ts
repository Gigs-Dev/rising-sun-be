import { Router } from 'express';

import { sendSignupOtp, sendLoginOtp, signUp, login } from '../../controller/user/auth.controller';

const router = Router()

router.route('/signupotp').post(sendSignupOtp);

router.post('/signinotp', sendLoginOtp);

router.route('/signup').post(signUp);

router.post('/signin', login);


export default router;


