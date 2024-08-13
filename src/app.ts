import  express, { Express, json, urlencoded } from "express";
import connectDB from "./config/db";

const app: Express = express();



app.use(json());
app.use(urlencoded({extended: true} ));


const PORT = 8800 || process.env.PORT

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
    connectDB()
})
