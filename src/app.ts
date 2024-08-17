import  express, { Express, json, urlencoded } from "express";
import connectDB from "./config/db";
import cors from 'cors';


const app: Express = express();



app.use(json());
app.use(urlencoded({extended: true} ));


const PORT = 8800;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
    connectDB()
})
