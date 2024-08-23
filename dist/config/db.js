"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const { set, connect, connection } = mongoose_1.default;
dotenv_1.default.config();
const connectDB = () => {
    set('strictQuery', true);
    const DB_URI = process.env.DB_URI;
    if (!DB_URI) {
        throw new Error('DB_URI is not defined in the environment variables');
    }
    connect(DB_URI)
        .then(() => {
        console.log('DB connection successful!');
    })
        .catch((err) => {
        console.error('Could not establish a connection', err.message);
    });
    connection.on('connected', () => {
        console.log('DB connection successful!');
    });
    connection.on('error', (err) => {
        console.error(err.message);
    });
    connection.on('disconnection', () => {
        console.log('DB disconnectioned');
    });
};
exports.default = connectDB;
// 'mongodb://localhost:27017/risingsun'
