import { Router } from "express";
import { verifyUserToken } from "../../middleware/verifyToken";
import { authorizeAdmin } from "../../middleware/auth.middleware";
import { banUser, getUsers, unBanUser } from "../../controllers/admin/admin.users.controller";


const adminUsersRoute = Router();


adminUsersRoute.get('/users', verifyUserToken, authorizeAdmin, getUsers)

adminUsersRoute.patch('/users/:id/ban', verifyUserToken, authorizeAdmin, banUser);

adminUsersRoute.patch('/users/:id/unban', verifyUserToken, authorizeAdmin, unBanUser)


export default adminUsersRoute;

