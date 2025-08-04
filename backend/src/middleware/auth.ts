//middleware are like checkpoints in application flow , they can see and
//change both incoming req and outgoing res
//they can also decide whether to continue the flow or stop it
//this makes them important for checking who the user is and what they can do

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";


// Extend Express Request type to include user
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUser;

    }
  }
}

// declare global: "Hey TypeScript, I'm making a global announcement that applies everywhere."
// namespace Express: "This announcement is about the 'Express' library's types."
// interface Request: "Specifically, I'm updating the blueprint for the Request backpack."
// user?: any;: "I'm adding a new, optional pocket named user. 
// The ? makes it optional because it might not be there on every request 
// (like for users who aren't logged in). The any type means
//  I can put whatever I want in this pocket and you shouldn't worry about its type."
// So, you're telling TypeScript, "For my app, the Request object can now have a user property,"
//  which makes it happy and allows you to attach user data in your authentication middleware
//  without getting a type error.

/**
 * Defines the shape of the JWT payload after decoding.
 */
interface JwtPayload {
  userId: string;
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction //next is a function that tells Express to continue to the next middleware or route handler
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();


  } catch (error) {
    res.status(401).json({ message: "Invalid authentication token" });
    console.error("Authentication error:", error);
  }
};