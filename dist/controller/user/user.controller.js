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
exports.creditReferer = exports.getReferals = void 0;
const user_model_1 = __importDefault(require("../../model/user.model"));
const api_response_1 = require("../../util/api-response");
const getReferals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { referalId } = req.params;
        const user = yield user_model_1.default.findOne({ referalId }).populate('referals');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const referrals = yield user_model_1.default.find({ _id: { $in: user.referals } });
        return res.status(200).json({ referrals });
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.getReferals = getReferals;
const creditReferer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.creditReferer = creditReferer;
