import  express, { Express, json, urlencoded } from "express";
import connectDB from "./config/db";
import cors from 'cors';
import authRoute from './routes/user/auth.route';
import userRoute from './routes/user/user.route';
import postRoute from './routes/post/post.route';
import tradeRoute from './routes/trade/trade.route';
import paymentRoute from './routes/payment/payment.routes';
// import compression from "compression";
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from "morgan";

dotenv.config();



const app: Express = express();

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
// app.use(compression({ filter: shouldCompress }));
app.use(json());
app.use(urlencoded({extended: true} ));
app.use(morgan('common'))
app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'] 
}))



//routes use 
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/trade', tradeRoute);
app.use('/api/payment', paymentRoute)



const PORT = 8800;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
    connectDB()
})
