import mongoose from "mongoose";
import dotenv from 'dotenv';
const { set, connect, connection } = mongoose;

dotenv.config();

const connectDB = () => {

    set('strictQuery', true);

    const DB_URI = process.env.DB_URI;

    if (!DB_URI) {
        throw new Error('DB_URI is not defined in the environment variables');
    }

    connect(DB_URI)
        .then(() => {
            console.log('DB connection successful!');
        })
        .catch((err) => {
            console.error('DB connection error:', err.message);
        });


    connection.on('connected', () => {
        console.log('DB connection successful!')
    })

    connection.on('error', (err) => {
       console.error(err.message)
    })
    connection.on('disconnection', () => {
        console.log('DB disconnectioned')
    })

}

export default connectDB;


// 'mongodb://localhost:27017/risingsun'