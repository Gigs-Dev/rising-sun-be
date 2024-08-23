"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trade_contoller_1 = require("../../controller/trade/trade.contoller");
const router = (0, express_1.Router)();
router.route('/create').post(trade_contoller_1.createTrade);
router.route('/:userId').get(trade_contoller_1.tradeHistory);
exports.default = router;
