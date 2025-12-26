import { Router } from "express";
import { signIn, signOut, signUp, verifySignUpOTP } from "../controllers/auth.controller";

const authRouter = Router();


authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('/verify-signup-otp', verifySignUpOTP);

authRouter.post('sign-out', signOut);




export default authRouter;
