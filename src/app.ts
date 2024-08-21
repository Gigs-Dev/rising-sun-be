import  express, { Express, json, urlencoded } from "express";
import connectDB from "./config/db";
import cors from 'cors';
import authRoute from './routes/user/auth.route';


const app: Express = express();



app.use(json());
app.use(urlencoded({extended: true} ));
app.use(cors())

//routes use 
app.use('/api/auth', authRoute);


const PORT = 8800;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
    connectDB()
})
