import express, { Application, Request, Response} from "express";
import { IndexRouter } from "./app/routes";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req: Request, res:Response) => {
  res.send("Hello World!");
});


app.use("/api/v1", IndexRouter);


export default app;