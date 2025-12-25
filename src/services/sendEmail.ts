import nodemailer, { createTransport } from 'nodemailer';
import { USER_EMAIL, USER_PASSWORD } from '../config/env.config';


const transport = createTransport({
    service: 'gmail',
    auth: {
        user: USER_EMAIL,
        pass: USER_PASSWORD
    }
})

export default transport;
