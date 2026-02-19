import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { DoctorService } from "./doctor.service";
import { sendResponse } from "../../helpers/sendResponse";
import status from "http-status";

const getAllDoctors = catchAsync(async(req:Request, res:Response) => {
    const result = await DoctorService.getAllDoctors();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctors retrieved successfully",
        data: result
    })
})


//TODO: Implement updateDoctor, deleteDoctor (soft delete), getDoctorById

export const DoctorController = {
    getAllDoctors
}