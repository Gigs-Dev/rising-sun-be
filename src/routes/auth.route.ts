import { Router } from "express";
import { signIn, signUp, verifyOTP } from "../controllers/auth.controller";

const authRouter = Router();


authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('/verify-otp', verifyOTP);


export default authRouter;
