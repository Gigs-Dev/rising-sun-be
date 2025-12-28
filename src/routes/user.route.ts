import { Router } from "express";
import { getAllUsers, getUserDetails, updateUserDetails } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.get('/:id', getUserDetails);

userRouter.patch('/:id', updateUserDetails)


export default userRouter;
