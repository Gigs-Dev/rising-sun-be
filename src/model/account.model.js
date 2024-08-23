"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AccountSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    status: {
        type: String,
        enum: ['idle', 'pending', 'successful', 'failed'],
        default: 'idle'
    },
    flutterwaveRef: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
const Account = (0, mongoose_1.model)('Account', AccountSchema);
exports.default = Account;
