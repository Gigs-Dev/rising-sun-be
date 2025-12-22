import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression'
import helmet from 'helmet';

import { PORT } from './config/env.config';
import connectDB from './config/db';
import { globalErrorHandler } from './middleware/errorHandler';


const app = express();

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(morgan('common'))
app.use(compression())
app.use(helmet())



// Global error
app.use(globalErrorHandler)

app.listen(PORT, async () => {
    console.log(`Server started at port ${PORT}`)
    await connectDB();
})

