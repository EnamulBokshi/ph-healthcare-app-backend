import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import status from "http-status";

export const globalErrorHandler= async (err:any, req: Request, res: Response, next: NextFunction) => {

  if(env.NODE_ENV === "development"){
     console.error('Error from global error handler:', err);
  }
  let statusCode = status.INTERNAL_SERVER_ERROR;
  let message: string = 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message || "Internal Server Error"
  });
}