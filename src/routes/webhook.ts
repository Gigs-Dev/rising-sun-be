import { Router } from "express";
import { verifyUserToken } from "../middleware/verifyToken";
import { flutterwaveWebhook } from "../controllers/webhook";

const webhookRouter = Router();

webhookRouter.post('/flutterwave', verifyUserToken, flutterwaveWebhook)


export default webhookRouter;
