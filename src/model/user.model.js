"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    acctId: {
        type: String,
        unique: true
    },
    refereeId: {
        type: String
    },
    referalId: {
        type: String,
        required: true,
        unique: true
    },
    acctType: {
        type: String,
        required: true,
        enum: ['real', 'demo'],
    },
    acctBal: {
        type: Number,
        required: true,
        default: 0
    },
    referals: {
        type: Array,
        default: []
    }
}, { timestamps: true });
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
