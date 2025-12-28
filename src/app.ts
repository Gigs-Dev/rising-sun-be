import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.config';
import connectDB from './lib/db';
import { globalErrorHandler } from './middleware/errorHandler';


// =============
// Routes Import
// =============
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import { RefreshToken } from './controllers/refreshToken.controller';


const app = express();

// middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(morgan('common'))
app.use(compression())
app.use(helmet())


// ============
// Routes Usage
// ============
app.use('/api/auth/refreshToken', RefreshToken)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);



// Global error
app.use(globalErrorHandler)

console.log({
  NODE_ENV: process.env.NODE_ENV,
  DB_URI: process.env.DB_URI ? "SET" : "MISSING",
});

app.listen(PORT, async () => {
    console.log(`Server started at port ${PORT}`)
    await connectDB();
})

