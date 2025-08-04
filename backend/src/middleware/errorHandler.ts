import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export class AppError extends Error {
  //this allows us to create a custom error class that extends the built-in Error class
  //This class will have additional properties like statusCode, status, and isOperational
  statusCode: number;
  status: string;
  isOperational: boolean;

  // constructor(...): When you create a new error like new AppError('User not found', 404), this function runs. It sets all the properties on the error object.
  // statusCode: This will hold the HTTP status code (e.g., 400 for Bad Request, 404 for Not Found).
  // status: A simple string that will be part of the JSON response. It's set to
  //isoperational: This is a very important boolean flag.
  //  It helps us distinguish between errors we expect to happen during normal operation 
  // (e.g., a user enters the wrong password) and true bugs in our code.
  constructor(message: string, statusCode: number) {
    super(message); // Calls the constructor of the parent 'Error' class
    this.statusCode = statusCode;
    // Set a simple status text based on the status code
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // Mark this as an operational error that we trust
    this.isOperational = true;
  
    //this line ensures that the stack trace points to where the error was created, not inside this class
    // This is useful for debugging, as it shows the exact line in your code where the error occurred.
    // It captures the stack trace, excluding our own constructor from it
    // The stack trace is a list of function calls that were active at the time the error was thrown
    // This makes your error logs cleaner and more useful.
    Error.captureStackTrace(this, this.constructor);
  }
}//apperror is helpful for debugging and also helps to know which errors are system errors and which are operational errors

//main middleware to handle error
// This function is the main error handler for your Express application.
// It catches errors thrown in your routes or controllers and sends a proper response to the client.
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  //next is a function that tells Express to continue to the next middleware or route handler
  // If you call next(err), it will skip all other middleware and go straight to the error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // If the error is an instance of AppError, it's an operational error expected 
  //it sends a response with the status code and message defined in the AppError
  // This is useful for errors like "User not found" or "Invalid input"
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //same thing written under
//   if (err instanceof AppError): The first thing it does is check if the error
//  it received is one of our custom AppErrors.
// If it is, we know it's an "operational" error that we created on purpose.
//  We can trust its contents, so we send a JSON response back to the client using the statusCode and message from the error object.

  // Log unexpected errors
  logger.error("Unexpected error:", err);
//   If the error is not an AppError, it means something unexpected went wrong—a bug, a database failure, etc.
// logger.error(...): We first log the complete error details. This is for the developers' eyes only, so they can see what happened and fix the bug.

  // Send generic error for unexpected errors
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
// return res.status(500).json(...): We then send a generic 500 error to the client. We do not send the details of the actual error (err.message or err.stack) because that could leak sensitive information about our server's inner workings.






// Overview: What is this file for?
// This file defines a centralized error-handling strategy for your entire backend application.
// In Express, you can have many different routes and controllers. Instead of writing 
// try...catch blocks and sending error responses from every single function,
//  you can create a special type of middleware that catches all errors that occur anywhere in your application.

// This errorHandler middleware is designed to be the final "safety net." Its job is to:
// Catch all errors, whether they are expected (like "Invalid Password") or unexpected (like a database crash).
// Decide what kind of response to send to the user based on the type of error.
// Log unexpected errors for developers to debug, without exposing sensitive details to the end-user.

// This is a custom error class that you can use throughout your application to create predictable, "operational" errors.
// export class AppError extends Error:
//  We're creating our own error type called AppError that has all the features of JavaScript's built-in Error class, plus some extra properties.
// statusCode: This will hold the HTTP status code (e.g., 400 for Bad Request, 404 for Not Found).
// status: A simple string that will be part of the JSON response. It's set to "fail" for client-side errors (4xx) and "error" for server-side errors (5xx).
// isOperational: This is a very important boolean flag. It helps us distinguish between errors we expect to happen during normal operation (e.g., a user enters the wrong password) and true bugs in our code.
// constructor(...): When you create a new error like new AppError('User not found', 404), this function runs. It sets all the properties on the error object.
// Error.captureStackTrace(...): This is a neat utility that makes your error logs cleaner. It ensures that when you look at the error's stack trace, it points to the line where you created the AppError, not to the inside of the AppError class itself.
