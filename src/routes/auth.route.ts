import { Router } from "express";
import { createUser, forgortPassword, signIn, signOut, signUp, verfiyForgotPassword, verifySignUpOTP } from "../controllers/auth.controller";

const authRouter = Router();


authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('/verify-signup-otp', verifySignUpOTP);

authRouter.post('/create-user', createUser);

authRouter.post('/sign-out', signOut);

authRouter.post('/forgot-password', forgortPassword);

authRouter.post('/verify-forgot-password', verfiyForgotPassword)



export default authRouter;
