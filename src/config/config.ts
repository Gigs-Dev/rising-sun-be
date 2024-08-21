import { EnvConfig } from "./get-env";

export const nodemailerConfig = {
    user: EnvConfig.mailUser,
    password: EnvConfig.mailPassword,
    mailPort: parseInt(EnvConfig.mailPort)
}

export const db = {
    uri: EnvConfig.DB_URI,
    minPoolSize: parseInt(EnvConfig.minPoolSize),
    maxPoolSize: parseInt(EnvConfig.maxPoolSize),
}
