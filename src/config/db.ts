import mongoose, { set } from "mongoose";

const connectDB = async () => {
    try {
        set('strictQuery', false);

        await mongoose.connect('');

        console.log(`DB connected on mode`)
    } catch (error) {
        console.log('DB connection error', error instanceof Error)
    }

    mongoose.connection.on('disconnected', () => {
        console.log('DB disconnected!')
    })
}

export default connectDB;
