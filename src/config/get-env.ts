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
    mailPort: getEnv<string>("EMAIL_PORT"),
    JwtPrivateKey: getEnv<string>("JWT_PRIVATE_KEY"),
    JwtAuthExpiration: getEnv<string>("JWT_AUTH_EXPIRATION"),
    JwtResetPwdExpiration: getEnv<string>("JWT_RESET_PWD_EXPIRATION"),
    DB_URI: getEnv<string>("DB_URI"),
    minPoolSize: getEnv<string>("DB_MINPOOL_SIZE"),
    maxPoolSize: getEnv<string>("DB_MAXPOOL_SIZE"),
}
