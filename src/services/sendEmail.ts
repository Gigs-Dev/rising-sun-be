import nodemailer, { createTransport } from 'nodemailer';
import { USER_EMAIL, USER_PASSWORD } from '../config/env.config';


const transport = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
        user: 'officialsrisingsun@gmail.com',
        pass: 'ibfg osdx rpay etwx'
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
})

export default transport;
