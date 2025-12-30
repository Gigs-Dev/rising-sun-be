import { createTransport } from 'nodemailer';
import { Resend } from "resend";
import { USER_EMAIL, USER_PASSWORD, RESEND_API_KEY } from '../config/env.config';
import { AppError } from '../utils/app-error';
import { HttpStatus } from '../constants/http-status';


export const transport = createTransport({
    host: "smtp.gmail.com",
    port: 467,
    secure: true,
    service: 'gmail',
    auth: {
        user: USER_EMAIL,
        pass: USER_PASSWORD
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
})


const resend = new Resend(RESEND_API_KEY);

export async function ResendEmail(email: string, subject: string, html: any) {
    const { data, error } = await resend.emails.send({
    from: "official.risebet@gmail.com",
    to: email,
    subject: subject,
    html: html,
  });

  if(error){
     return new AppError('Email Sending failed', HttpStatus.INTERNAL_SERVER_ERROR)
  }

  if(data){
    return data
  }
}
