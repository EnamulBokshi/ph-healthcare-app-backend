import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { IRequestUser } from "../../../interfaces/requestUser.interface";
import { IUpdatePatientProfilePayload } from "./patient.interface";
import { PatientService } from "./patient.service";
import { sendResponse } from "../../helpers/sendResponse";
import status from "http-status";

const updateMyProfile = catchAsync(async(req: Request, res:Response) => {
    const user = req.user as IRequestUser;
    const payload = req.body as IUpdatePatientProfilePayload;
    
    const result = await PatientService.updateMyProfile(user, payload);
    
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Patient profile updated successfully",
        data: result,
    })
});



export const PatientController = {
    updateMyProfile,
}