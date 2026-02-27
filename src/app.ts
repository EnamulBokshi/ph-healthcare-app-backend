import express, { Application, NextFunction, Request, Response} from "express";
import { IndexRouter } from "./app/routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { NotFoundMiddleware } from "./middleware/notfound";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())

app.get("/", (req: Request, res:Response) => {
  res.send("Hello World!");
});


app.use("/api/v1", IndexRouter);

app.use(globalErrorHandler);

app.use(NotFoundMiddleware)

export default app;