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
exports.sendOtp = exports.newUser = exports.login = void 0;
const user_model_1 = __importDefault(require("../../model/user.model"));
const requestOtp_1 = require("../../services/auth/requestOtp");
const api_response_1 = require("../../util/api-response");
const verifyOtp_1 = require("../../services/auth/verifyOtp");
const generateId_1 = require("../../services/auth/generateId");
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const otp = yield (0, requestOtp_1.requestOtp)({ email });
        res.status(200).json({ otp: otp });
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.sendOtp = sendOtp;
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, inputCode, refereeId } = req.body;
        const isOtpValid = yield (0, verifyOtp_1.verifyOtp)(email, inputCode);
        if (!isOtpValid)
            return res.status(403).json({ message: 'Otp not valid or has expired' });
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            const generatedId = yield (0, generateId_1.generateAcctID)();
            const generatedReferalId = yield (0, generateId_1.generateReferalId)(email);
            const newUser = yield user_model_1.default.create(Object.assign(Object.assign({}, req.body), { acctType: 'real', acctId: generatedId, referalId: generatedReferalId }));
            if (refereeId) {
                yield user_model_1.default.updateOne({ referalId: refereeId }, { $push: { referals: newUser._id } });
            }
            return res.status(201).json({ user: newUser });
        }
        else {
            return res.status(200).json({ user: user });
        }
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.newUser = newUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, inputCode } = req.body;
        const isVerified = yield (0, verifyOtp_1.verifyOtp)(email, inputCode);
        if (!isVerified)
            return res.status(403).json({ message: 'Otp not valid or has expired' });
        const user = yield user_model_1.default.findOne({ email });
        res.status(201).json(user);
    }
    catch (error) {
        (0, api_response_1.handle500Errors)(error, res);
    }
});
exports.login = login;
