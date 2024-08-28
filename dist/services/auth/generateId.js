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
exports.generateReferalId = exports.generateAcctID = void 0;
const user_model_1 = __importDefault(require("../../model/user.model"));
const generateAcctID = () => __awaiter(void 0, void 0, void 0, function* () {
    const acctAlias = 'REA';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart;
    let newAcctID;
    do {
        randomPart = '';
        for (let i = 0; i < 6; i++) {
            if (i === 3) {
                randomPart += '-';
            }
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        newAcctID = `${acctAlias}-${randomPart}`;
    } while (yield user_model_1.default.exists({ acctId: newAcctID }));
    return newAcctID;
});
exports.generateAcctID = generateAcctID;
const generateReferalId = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const emailPrefix = email.slice(0, 3).toUpperCase();
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    let referalId = `${emailPrefix}${randomPart}`;
    // Ensure the referalId is unique
    while (yield user_model_1.default.exists({ referalId })) {
        referalId = `${emailPrefix}${Math.floor(1000 + Math.random() * 9000).toString()}`;
    }
    return referalId;
});
exports.generateReferalId = generateReferalId;
// export const generateAcctID = (): string => {
//     const acctAlias = 'REA';
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let randomPart = '';
//     for (let i = 0; i < 6; i++) {
//       if (i === 3) {
//         randomPart += '-';
//       }
//       randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return `${acctAlias}-${randomPart}`;
// };
