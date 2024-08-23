"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvConfig = void 0;
const logger_1 = __importDefault(require("../util/logger"));
const getEnv = (name) => {
    const value = process.env[name];
    if (value === undefined || value === null) {
        logger_1.default.warn(`Environment variable ${name} is required!`);
    }
    return value;
};
exports.EnvConfig = {
    mailUser: getEnv("EMAIL_USER"),
    mailPassword: getEnv("MAIL_PASSWORD"),
    mailPort: getEnv("EMAIL_PORT"),
    JwtPrivateKey: getEnv("JWT_PRIVATE_KEY"),
    JwtAuthExpiration: getEnv("JWT_AUTH_EXPIRATION"),
    JwtResetPwdExpiration: getEnv("JWT_RESET_PWD_EXPIRATION"),
    DB_URI: getEnv("DB_URI"),
    minPoolSize: getEnv("DB_MINPOOL_SIZE"),
    maxPoolSize: getEnv("DB_MAXPOOL_SIZE"),
};
