import nodemailer from "nodemailer";
import { nodemailerConfig } from "../config/config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: nodemailerConfig.mailPort,
  secure: false,
  auth: {
    user: nodemailerConfig.user,
    pass: nodemailerConfig.password,
  },
  tls: { rejectUnauthorized: true },
});
