import { config } from 'dotenv';

config({
    path: `./.env.${process.env.NODE_ENV || 'development'}`
})

export const {
    PORT,
    NODE_ENV,
    DB_URI,
    USER_EMAIL,
    USER_PASSWORD,
    CLIENT_URL
} = process.env;
