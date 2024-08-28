"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle500Errors = void 0;
exports.makeRes = makeRes;
exports.makeApiRes = makeApiRes;
const logger_1 = __importDefault(require("./logger"));
function makeRes(status, msg) {
    return { status, msg };
}
function makeApiRes(res, data) {
    res = res.status(data.status);
    if (data.status < 300) {
        res.status(data.status).json({ data: data.data });
    }
    else {
        res.status(data.status).json({ msg: data.msg });
    }
}
const handle500Errors = (err, res) => {
    logger_1.default.warn(err.message);
    res.status(500).json({
        status: 500,
        msg: "This is on us. Our team is working to resolve this issue, thanks for your understanding",
    });
};
exports.handle500Errors = handle500Errors;
