import { createTransport } from 'nodemailer';
import { USER_EMAIL, USER_PASSWORD } from '../config/env.config';


const transport = createTransport({
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

export default transport;
