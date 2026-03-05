import express, { Application, NextFunction, Request, Response} from "express";
import { IndexRouter } from "./app/routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { NotFoundMiddleware } from "./middleware/notfound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "node:path";
import cors from "cors";
import { env } from "./config/env";
import qs from "qs";
import { PaymentController } from "./app/modules/payment/payment.controller";
import cron from 'node-cron'
import { AppointmentService } from "./app/modules/appointment/appointment.service";
const app: Application = express();

app.set("query parser", (str:string)=> qs.parse(str));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/templates"));

app.post("/webhook", express.raw({type: "application/json"}), PaymentController.handleStripeWebhookEvent)

app.use( cors({
  origin: [env.FRONTEND_URL, env.BETTER_AUTH_URL, "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use("api/auth", toNodeHandler(auth));

app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())

app.get("/", (req: Request, res:Response) => {
  res.send("Hello World!");
});

cron.schedule("*/25 * * * *", async ()=> {
  try {
    
    console.log('Runnng cron job to cancel unpaid appointments');
    await AppointmentService.cancelUnpaidAppointments();
  } catch (error:any) {
    console.error('Error occurred while canceling unpaid appointments:', error);

  }

})


app.use("/api/v1", IndexRouter);

app.use(globalErrorHandler);

app.use(NotFoundMiddleware)

export default app;