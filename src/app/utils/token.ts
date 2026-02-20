import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { env } from "../../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";
import ms, { StringValue } from 'ms'

const getAccesToken = (payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, env.ACCESS_TOKEN_SECRET, {expiresIn: env.ACCESS_TOKEN_EXPIRES_IN} as  SignOptions)
    return accessToken;
}

const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, env.REFRESH_TOKEN_SECRET, {expiresIn: env.REFRESH_TOKEN_EXPIRES_IN} as SignOptions)
    return refreshToken;
}

const setAccessTokenCookie = (res: Response, token: string) => {
    cookieUtils.setCookie(res, "accessToken", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 60*60*60*24*1, // 1 days
        path: "/"
    })
}
 

const setRefreshTokenCookie = (res: Response, token: string) => {
    
    cookieUtils.setCookie(res, "refreshToken", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "none",
        // 7d
        maxAge: 60*60*60*24*7, 
        path: "/"

    })
}

const setBetterAuthSessionCookie = (res: Response, token: string) => {
    
    cookieUtils.setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 60*60*60*24*1, // 1 days
        path: "/"
    })
}

export const tokenUtils = {
    getAccesToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie
}