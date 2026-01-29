import { Router } from "express";
import { getUserDetails, updatePassword, updateUserDetails,getMyReferrals  } from "../controllers/user.controller";
import { authorizeUser } from "../middleware/auth.middleware";
import { verifyUserToken } from "../middleware/verifyToken";

const userRouter = Router();



userRouter.get('/:id', verifyUserToken, authorizeUser, getUserDetails);

userRouter.get('/:id/referrals', verifyUserToken, authorizeUser, getMyReferrals )

userRouter.patch('/:id', verifyUserToken,  authorizeUser, updateUserDetails);

userRouter.patch('/:id/password', verifyUserToken, authorizeUser, updatePassword)


export default userRouter;
