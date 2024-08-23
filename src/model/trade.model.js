"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TradeSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
        required: true
    },
    outcome: {
        type: String,
        enum: ['win', 'lost', 'neutral']
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });
const Trade = (0, mongoose_1.model)('Trade', TradeSchema);
exports.default = Trade;
