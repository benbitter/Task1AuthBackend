import mongoose from "mongoose";

const connectDb = async()=>{
    await mongoose.connect(process.env.DB_ID)
    // await mongoose.connect("mongodb://127.0.0.1:27017/Task1")
    console.log("Connected to MongoDB")
}

export{connectDb}