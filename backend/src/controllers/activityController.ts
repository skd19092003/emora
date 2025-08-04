import { Request, Response, NextFunction } from "express";
import { Activity} from "@/models/Activity";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IActivity } from "@/models/Activity";
import { logger } from "@/utils/logger";

export const logActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, name, description, duration, difficulty, feedback } = req.body;
        //note difficulty and feedback are not in iactivity interface or activity schema
        //if we want to use them , we need to update the model accordingly 
        const userId = req.user?._id; // Get user ID from authenticated request
        //this is where auth middleware is used if user is authenticated, req.user will have user data as auth middleware wpuld attach user data to req
        //if user is not authenticated, req.user will be undefined
        //we safely access the chatid  from it 
        if (!userId) {
            return res.status(401).json({ message: "user not authenticated" });
        }
        //next a new activity instance is created with the provided data
        //with the user id provided by the request 
        const activity = new Activity({
            userId,
            type,
            name,
            description,
            duration,
            difficulty,
            feedback,
            timestamp: new Date(),
        });

        await activity.save();
        //new activity is saved to  mongo db database

        logger.info(`Activity logged for user ${userId}`);

       

        res.status(201).json({
            success: true,
            data: activity,
        });

    } catch (error) {

        next(error);
        //here we are passing the error to the next middleware which is the error handler which is used in errorhandle next function 
    }
};