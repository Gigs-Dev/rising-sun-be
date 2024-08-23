"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.nodemailerConfig = void 0;
const get_env_1 = require("./get-env");
exports.nodemailerConfig = {
    user: get_env_1.EnvConfig.mailUser,
    password: get_env_1.EnvConfig.mailPassword,
    mailPort: parseInt(get_env_1.EnvConfig.mailPort)
};
exports.db = {
    uri: get_env_1.EnvConfig.DB_URI,
    minPoolSize: parseInt(get_env_1.EnvConfig.minPoolSize),
    maxPoolSize: parseInt(get_env_1.EnvConfig.maxPoolSize),
};
