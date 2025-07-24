import express from "express";
import {Request, Response} from "express";
import {serve} from "inngest/express";
import {inngest} from "./inngest";
import { functions as inngestFunctions } from "./inngest/functions";
//we will use or logger as middleware
import {logger} from "./utils/logger";
import { connectDB } from "./utils/db";
import dotenv from "dotenv";

dotenv.config();

const app = express();


app.use(express.json());

app.use("/api/inngest", serve({ client: inngest, functions: inngestFunctions }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

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