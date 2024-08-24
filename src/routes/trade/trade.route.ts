import { Router } from "express";
import { tradeHistory, createTrade } from "../../controller/trade/trade.contoller";
import { verifyUser } from "../../util/verifyJwt";

const router = Router();

router.route('/create').post(verifyUser, createTrade);

router.route('/:userId').get(verifyUser, tradeHistory);


export default router;
