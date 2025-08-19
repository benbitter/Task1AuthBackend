import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"
import { Server } from "socket.io";
import authRouter from "./routes/auth.route.js"



const app = express();


dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "https://task1client.onrender.com",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
const httpServer = http.createServer(app);

app.use("/api/v1/auth", authRouter);


//TODO : incase other routes cannote accessed and website crashes show server side rendered page
app.get('/',(req,res)=>{
    res.status(200).send("Welcome to the Auth Service");
})



export{httpServer}
