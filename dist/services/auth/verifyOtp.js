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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = verifyOtp;
const otp_model_1 = require("../../model/otp.model");
function verifyOtp(email, inputCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const otpRecord = yield otp_model_1.OtpModel.findOne({ email }).sort({ expiresAt: -1 });
        if (!otpRecord)
            return false;
        const currentTime = new Date();
        if (otpRecord.code === inputCode && currentTime <= otpRecord.expiresAt) {
            return true;
        }
        return false;
    });
}
