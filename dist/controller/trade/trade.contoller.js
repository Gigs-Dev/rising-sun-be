"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeHistory = exports.createTrade = void 0;
const api_response_1 = require("../../util/api-response");
const trade_model_1 = __importDefault(require("../../model/trade.model"));
const createTrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.createTrade = createTrade;
const tradeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const trades = yield trade_model_1.default.find({ user: userId });
        if (!trades || trades.length === 0) {
            res.status(404).json({ message: 'No trade found for this user' });
            return;
        }
        res.status(200).json(trades);
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.tradeHistory = tradeHistory;
