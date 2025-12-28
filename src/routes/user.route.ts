import { Router } from "express";
import { getAllUsers, getUserDetails, updatePassword, updateUserDetails } from "../controllers/user.controller";
import { authorizeUser } from "../middleware/auth.middleware";
import { verifyUserToken } from "../middleware/verifyToken";

const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.get('/:id', authorizeUser, verifyUserToken, getUserDetails);

userRouter.patch('/:id', authorizeUser, verifyUserToken,  updateUserDetails);

userRouter.patch('/:id/password', authorizeUser, verifyUserToken,  updatePassword)


export default userRouter;
