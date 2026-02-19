import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../helpers/sendResponse";
import status from "http-status";

const createDoctor =  catchAsync(async (req:Request, res:Response) => {
    const payload = req.body;
    if(!payload.doctor || !payload.doctor.name || !payload.doctor.email || !payload.password) {
        throw new Error("Missing required fields: doctor.name, doctor.email, password");
    }
    const result = await UserService.createDoctor(payload);
    sendResponse(res,{
        httpStatusCode: status.CREATED,
        success: true,
        message: "Doctor created successfully",
        data: result
    })
})


export const UserController = {
    createDoctor
}