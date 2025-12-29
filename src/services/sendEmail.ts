import nodemailer, { createTransport } from 'nodemailer';
import { USER_EMAIL, USER_PASSWORD } from '../config/env.config';


const transport = createTransport({
    service: 'gmail',
    auth: {
        user: 'officialsrisingsun@gmail.com',
        pass: 'ibfgosdxrpayetwx'
    }
})

export default transport;
