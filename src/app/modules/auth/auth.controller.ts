import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../helpers/sendResponse";
import status from "http-status";

const registerPatient = catchAsync(async(req:Request, res: Response) => {
    const payload = req.body;
    if(!payload.name || !payload.email || !payload.password) {
        throw new Error("Missing required fields: name, email, password");
    }

    const data = await AuthService.registerPatient(payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Patient registered successfully",
        data
    })

})

const loginUser = catchAsync(async(req: Request, res: Response) => {
    const payload = req.body;
    if(!payload.email || !payload.password) {
        throw new Error("Missing required fields: email, password");
    }

    const data = await AuthService.loginUser(payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User logged in successfully",
        data
    })
})


export const AuthController = {
    registerPatient,
    loginUser   
}