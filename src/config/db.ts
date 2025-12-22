import mongoose, { set } from "mongoose";
import { DB_URI, NODE_ENV } from "./env.config";



const connectDB = async () => {

    if(!DB_URI){
        throw Error('Please provide a MONGO DB URI')
    }

    try {
        set('strictQuery', false);

        await mongoose.connect(DB_URI);

        console.log(`DB connected on ${NODE_ENV} mode`)
    } catch (error) {
        console.log('DB connection error', error instanceof Error)
    }

    mongoose.connection.on('disconnected', () => {
        console.log('DB disconnected!')
    })
}

export default connectDB;
