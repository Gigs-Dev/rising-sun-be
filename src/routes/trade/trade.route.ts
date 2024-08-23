import { Router } from "express";
import { tradeHistory, createTrade } from "../../controller/trade/trade.contoller";

const router = Router();

router.route('/create').post(createTrade);

router.route('/:userId').get(tradeHistory);


export default router;
