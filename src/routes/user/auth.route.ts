import { Router } from 'express';

import { sendSignupOtp, signUp, login } from '../../controller/user/auth.controller';

const router = Router()

router.route('/sendotp').post(sendSignupOtp);

router.route('/createnewsession').post(signUp);

router.post('/signin', login);


export default router;


