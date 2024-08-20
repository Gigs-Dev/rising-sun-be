import logger from "../util/logger";

const getEnv = <T>(name: string): T => {
    const value = process.env[name];
    if (value === undefined || value === null) {
      logger.warn(`Environment variable ${name} is required!`);
    }
    return value as unknown as T;
};

export const EnvConfig = {
    mailUser: getEnv<string>("EMAIL_USER"),
    mailPassword: getEnv<string>("MAIL_PASSWORD"),
}
