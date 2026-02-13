import { Router } from "express";
import { flutterwaveWebhook } from "../controllers/webhook";

const webhookRouter = Router();

webhookRouter.post('/flutterwave', flutterwaveWebhook)


export default webhookRouter;
