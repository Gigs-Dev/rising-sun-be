import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression'
import helmet from 'helmet';

import { PORT } from './config/env.config';
import connectDB from './lib/db';
import { globalErrorHandler } from './middleware/errorHandler';


// =============
// Routes Import
// =============
import authRouter from './routes/auth.route';


const app = express();

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(morgan('common'))
app.use(compression())
app.use(helmet())


// ============
// Routes Usage
// ============
app.use('/api/v1/auth', authRouter)



// Global error
app.use(globalErrorHandler)

app.listen(PORT, async () => {
    console.log(`Server started at port ${PORT}`)
    await connectDB();
})

