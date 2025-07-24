import express from "express";
import {Request, Response} from "express";
import {serve} from "inngest/express";
import {inngest, functions} from "./inngest";
//we will use or logger as middleware
import {logger} from "./utils/logger";

const app = express();


app.use(express.json());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
// });
//commented this to create a optimized server
const startServer = async () => {
    try {
        const port = process.env.PORT || 4000;
        app.listen(port, () => {
            logger.info(`server is running on port ${port}`);
            logger.info(`inngest endpoint available at http://localhost:${port}/api/inngest`);
            
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();