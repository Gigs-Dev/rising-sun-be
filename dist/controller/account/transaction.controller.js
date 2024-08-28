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
exports.getAccountHistory = exports.verifyDebit = exports.debitAccount = exports.verifyCredit = exports.creditAccount = void 0;
const account_model_1 = __importDefault(require("../../model/account.model"));
const api_response_1 = require("../../util/api-response");
const creditAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, amount } = req.body;
        // const paymentRef = await 
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.creditAccount = creditAccount;
const verifyCredit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.verifyCredit = verifyCredit;
const debitAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.debitAccount = debitAccount;
const verifyDebit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.verifyDebit = verifyDebit;
const getAccountHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const history = yield account_model_1.default.find({ user: userId }).sort({ createdAt: -1 });
        if (!history || history.length === 0) {
            res.status(404).json({ message: 'No transaction found for user' });
            return;
        }
        res.status(200).json(history);
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.getAccountHistory = getAccountHistory;
