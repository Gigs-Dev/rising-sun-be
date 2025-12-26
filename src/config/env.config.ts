import { config } from 'dotenv';

if (process.env.NODE_ENV !== "production") {
  config({
    path: `.env.${process.env.NODE_ENV || "development"}`
  });
}

export const {
    PORT,
    NODE_ENV,
    DB_URI,
    USER_EMAIL,
    USER_PASSWORD,
    FLW_PUBLIC_KEY,
    FLW_SECRET_KEY,
    FLW_ENCRYP_KEY,
    CLIENT_URL
} = process.env;

