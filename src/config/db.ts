import mongoose from "mongoose";

const { set, connect, connection } = mongoose;


const connectDB = () => {

    set('strictQuery', true)

    connect('mongodb://localhost:27017/risingsun')

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
