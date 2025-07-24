import mongoose from "mongoose";
import { logger } from "./logger";  
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
        logger.error("MONGODB_URI is not defined in environment variables.");
        process.exit(1);}

export const connectDB = async ()=>{
    try {
        await mongoose.connect(MONGODB_URI);
        
        //await keyword shows that  program pauses here until the connection process is either successful or fails
        logger.info("Connected to MongoDB Atlas");
    } catch (error) {
        logger.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}