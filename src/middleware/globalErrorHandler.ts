import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import status from "http-status";
import z from "zod";
import { IErrorResponse, IErrorSource } from "../interfaces/error.interface";
import zodErrorHelper from "../errorHelpers/zodErrorHelper";
import AppError from "../errorHelpers/AppError";
import { deleteFileCloudinary } from "../config/cloudinary";




export const globalErrorHandler= async (err:any, req: Request, res: Response, next: NextFunction) => {

  if(env.NODE_ENV === "development"){
     console.error('Error from global error handler:', err);
  }
  if(req.file){
    await deleteFileCloudinary(req.file.path)
  };

  if(req.files && Array.isArray(req.files)){

    const imageUrls = req.files.map((file) => file.path);

    await Promise.all(imageUrls.map( (url) => {
       deleteFileCloudinary(url);
    }))
  }
  let statusCode:number = status.INTERNAL_SERVER_ERROR;
  let message: string = 'An unexpected error occurred';
  let stack = undefined;
  let errorSources: IErrorSource[] = [];
  
  if (err instanceof z.ZodError) {
    const zodErrorResponse = zodErrorHelper(err);
    statusCode = zodErrorResponse.statusCode;
    message = zodErrorResponse.message;
    errorSources = [...zodErrorResponse.errorSources];
    stack = err.stack;
    

  } else if (err instanceof AppError){
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ]
  }
  
  else if(err instanceof Error) {
      statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: '',
        message: err.message
      }
    ]
  }

  const errorResponse:IErrorResponse = {
    statusCode,
    success: false,
    message,
    errorSources,
    stack: env.NODE_ENV === "development" ? stack : undefined,  
    error: env.NODE_ENV === "development" ? err : undefined,
  }

  res.status(statusCode).json(errorResponse);
}