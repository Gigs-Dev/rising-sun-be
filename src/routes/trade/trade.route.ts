import { Router } from "express";
import { tradeHistory, createTrade } from "../../controller/trade/trade.contoller";
import { verifyToken } from "../../util/verifyJwt";

const router = Router();

router.route('/newtrade').post(verifyToken, createTrade);

router.route('/:userId').get(verifyToken, tradeHistory);


export default router;
