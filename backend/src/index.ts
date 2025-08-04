import express from "express";
import {Request, Response} from "express";
import {serve} from "inngest/express";
import {inngest} from "./inngest";
import { functions as inngestFunctions } from "./inngest/functions";
//we will use or logger as middleware
import {logger} from "./utils/logger";
import { connectDB } from "./utils/db";
import dotenv from "dotenv";
import  cors  from 'cors';
import helmet from "helmet";
import morgan from 'morgan';
import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";



dotenv.config();

const app = express();

//middleware performs task like interpreting the request body, user authnetication, logging, recording events, setting response headers and compressing data.
app.use(cors()); // Enable CORS for all routes
//cors is a security feature that allows or restricts resources to be requested from another domain outside the domain from which the first resource was served
//in simple words, it allows your frontend to make requests to your backend without running into cross-origin issues
//it is a middleware that allows you to specify which domains are allowed to access your backend resources
//as fronmtend and backend  run on diff ports, browser will block requests from frontend to backend if CORS is not enabled
app.use(helmet()); // Set security-related HTTP headers
//helmet is a middleware that helps you secure your Express apps by setting various HTTP headers
//in simple words, it helps protect your app from common web vulnerabilities by setting secure HTTP headers
//setting secure http headers means headers that tell the browser how to behave when interacting with your app
//for example, it can prevent clickjacking, cross-site scripting (XSS), and other common attacks
app.use(morgan('dev')); // Log HTTP requests in development mode
//morgan is a middleware that logs HTTP requests to the console
//it is useful for debugging and monitoring your application 
//dev is a predefined format that logs the request method, URL, status code, response time, and in a good way


app.use(express.json());

app.use("/api/inngest", serve({ client: inngest, functions: inngestFunctions }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});


//require routes
//here we are importing the auth routes from the auth.ts file
//this is where we define the routes for the authentication endpoints
//in simple words we are telling our app to use the auth routes defined in the auth.ts file
//this is a modular way to organize your routes and keep your code clean
app.use("/auth", authRoutes);
//error HANDLER
app.use(errorHandler);
//this is a middleware that handles errors in the application



// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
// });
//commented this to create a optimized server
// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    // Then start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(
        `Inngest endpoint available at http://localhost:${PORT}/api/inngest`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();