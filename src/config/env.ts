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
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string;
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
    SUPER_ADMIN_NAME: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    SUPER_ADMIN_PHONE: string;
    SUPER_ADMIN_PROFILE_PHOTO_URL: string;
}





const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVars = [
        "PORT",
        "NODE_ENV",
        "BETTER_AUTH_URL",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
        "ACCESS_TOKEN_EXPIRES_IN",
        "REFRESH_TOKEN_EXPIRES_IN",
        "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
        "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
        "SUPER_ADMIN_NAME",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",
        "SUPER_ADMIN_PHONE",
        "SUPER_ADMIN_PROFILE_PHOTO_URL"
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
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
        SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE as string,
        SUPER_ADMIN_PROFILE_PHOTO_URL: process.env.SUPER_ADMIN_PROFILE_PHOTO_URL as string,

    }
}


export const env = loadEnvVariables();