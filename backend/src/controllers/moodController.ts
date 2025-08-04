import { Request, Response, NextFunction } from "express";
import { Mood } from "../models/Mood";
import { logger } from "../utils/logger";

export const createMood = async (
    req: Request,
    res: Response,
    next: NextFunction
    //this next function is used to pass control to the next middleware function in the stack
    //if there is an error, we can call next(error) to pass the error to the error handling middleware
) => {
    try {
        const { score, note, context, activities } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "user is unauthenticated}" });

        }
        //if user is auth, then we proceed to create the mood 
        const mood = new Mood({
            userId,
            score,
            note,
            context,
            activities,
            timestamp: new Date(),
        });
        await mood.save(); //thius will save mood to database
        logger.info(`Mood logged for user ${userId} with score ${score}`);

        res.status(201).json({
            success: true,
            data: mood,
        })

    } catch (error) {
        next(error);
    }


}
