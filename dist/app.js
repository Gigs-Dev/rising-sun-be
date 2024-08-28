"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/user/auth.route"));
const user_route_1 = __importDefault(require("./routes/user/user.route"));
const post_route_1 = __importDefault(require("./routes/post/post.route"));
const account_route_1 = __importDefault(require("./routes/account/account.route"));
const trade_route_1 = __importDefault(require("./routes/trade/trade.route"));
const compression_1 = __importDefault(require("compression"));
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
app.use((0, cors_1.default)());
//routes use 
app.use('/api/auth', auth_route_1.default);
app.use('/api/user', user_route_1.default);
app.use('/api/post', post_route_1.default);
app.use('/api/account', account_route_1.default);
app.use('/api/trade', trade_route_1.default);
const PORT = 8800;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
    (0, db_1.default)();
});
