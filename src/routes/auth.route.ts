import { Router } from "express";
import { signIn, signUp, verifySignUpOTP } from "../controllers/auth.controller";

const authRouter = Router();


authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('/verify-signin-otp', verifySignUpOTP);


export default authRouter;
