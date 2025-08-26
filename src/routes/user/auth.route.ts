import { Router } from 'express';

import { sendSignupOtp, sendLoginOtp, signUp, login } from '../../controller/user/auth.controller';

const router = Router()

router.post('/signupotp', sendSignupOtp);

router.post('/signinotp', sendLoginOtp);

router.post('/signup', signUp);

router.post('/signin', login);


export default router;


