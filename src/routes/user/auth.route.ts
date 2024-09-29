import { Router } from 'express';

import { sendOtp, newUser, login } from '../../controller/user/auth.controller';

const router = Router()

router.route('/sendotp').post(sendOtp);

router.route('/createnewsession').post(newUser);

router.post('/signin', login);


export default router;


