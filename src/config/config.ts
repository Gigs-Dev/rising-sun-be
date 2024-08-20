import { EnvConfig } from "./get-env";

export const nodemailerConfig = {
    user: EnvConfig.mailUser,
    password: EnvConfig.mailPassword,
}

