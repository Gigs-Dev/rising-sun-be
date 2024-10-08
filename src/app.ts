import  express, { Express, json, urlencoded } from "express";
import connectDB from "./config/db";
import cors from 'cors';
import authRoute from './routes/user/auth.route';
import userRoute from './routes/user/user.route';
import postRoute from './routes/post/post.route';
import accountRoute from './routes/account/account.route';
import tradeRoute from './routes/trade/trade.route';
import transactionRoute from './routes/transaction/transaction.route';
import compression from "compression";
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();



const app: Express = express();

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
app.use(compression());
app.use(json());
app.use(urlencoded({extended: true} ));
app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'] 
}))



//routes use 
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/account', accountRoute);
app.use('/api/trade', tradeRoute);
app.use('/api/transaction', transactionRoute);


app.use('/', (req, res) => {
    res.send('Conected to client');
})

const PORT = 8800;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
    connectDB()
})
