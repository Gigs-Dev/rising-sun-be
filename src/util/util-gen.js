"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomOTP = void 0;
const generateRandomOTP = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
};
exports.generateRandomOTP = generateRandomOTP;
