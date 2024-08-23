"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    desc: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Posts = (0, mongoose_1.model)('Posts', PostSchema);
exports.default = Posts;
