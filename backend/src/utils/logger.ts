//logger is a software component used to store events , errors and other important informations 
// during an application's execution

import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
//this code sets up a login system that logs errors to a file called "error.log" and all other logs to a file called "combined.log"
//by default it will record informational messages & severe warnings
//each log entry will include a timestamp and be formatted as a JSON object making it easy to analyze

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
//this code adds a console transport to the logger if the current environment is not production
//which will log messages to the console in a human-readable format
export { logger };
