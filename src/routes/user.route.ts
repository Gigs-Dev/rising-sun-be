import { Router } from "express";
import { getAllUsers, getUserDetails, updatePassword, updateUserDetails } from "../controllers/user.controller";
import { authorizeUser } from "../middleware/auth.middleware";
import { verifyUserToken } from "../middleware/verifyToken";

const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.get('/:id', verifyUserToken, authorizeUser, getUserDetails);

userRouter.patch('/:id', verifyUserToken,  authorizeUser, updateUserDetails);

userRouter.patch('/:id/password', verifyUserToken, authorizeUser, updatePassword)


export default userRouter;
