import mongoose from "mongoose";
import { DB_URI } from "../constants.js";

const connectDB = async () =>{
    try {
        await mongoose.connect(DB_URI);
        console.log("Database Connected");
    } catch (error) {
        console.log("Database Connection Failed", error);
        process.exit(1);
    }
};

export default connectDB;