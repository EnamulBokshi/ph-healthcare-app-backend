import dotenv from "dotenv";
import status from "http-status";
import AppError from "../errorHelpers/AppError";

dotenv.config();


interface EnvConfig {
    PORT:string;
    NODE_ENV: string;
    BETTER_AUTH_URL: string;
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
}





const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVars = [
        "PORT",
        "NODE_ENV",
        "BETTER_AUTH_URL",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET"
    ]
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new AppError(status.NOT_FOUND, `Missing required environment variable: ${envVar}`);
            
        }
    }
    return {
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string
    }
}


export const env = loadEnvVariables();