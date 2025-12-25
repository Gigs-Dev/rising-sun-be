import nodemailer, { createTransport } from 'nodemailer';


const transport = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
})

export default transport;
