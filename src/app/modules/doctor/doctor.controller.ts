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

const updateDoctor = catchAsync(async(req:Request, res:Response)=> {
    const {doctorId} = req.params;

    if(!doctorId) {
        sendResponse(res, {
            httpStatusCode: status.BAD_REQUEST,
            success: false,
            message: "Doctor id is required"
        })
        return;
    }
    const payload = req.body;
    const doctor = payload.doctor;
    const specialities = payload.specialities;
    const isDoctorExist = await DoctorService.getDoctorById(doctorId as string);
    if(!isDoctorExist) {
        sendResponse(res, {
            httpStatusCode: status.NOT_FOUND,
            success: false,
            message: "Doctor not found"
        })
        return;
    }

    const updatedDoctor = await DoctorService.updateDoctor(doctorId as string, doctor, specialities);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor updated successfully",
        data: updatedDoctor
    })
})

const deleteDoctor = catchAsync(async(req:Request, res:Response) => {
    const {doctorId} = req.params;
    if(!doctorId) {
        sendResponse(res, {
            httpStatusCode: status.BAD_REQUEST,
            success: false,
            message: "Doctor id is required"
        })
        return;
    }
    await DoctorService.deleteDoctor(doctorId as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor deleted successfully"
    })
})

const getDoctorById = catchAsync(async(req:Request, res:Response) => {
    const {doctorId} = req.params;
    if(!doctorId) {
        sendResponse(res, {
            httpStatusCode: status.BAD_REQUEST,
            success: false,
            message: "Doctor id is required"
        })
        return;
    }
    const doctor = await DoctorService.getDoctorById(doctorId as string);
    if(!doctor) {
        sendResponse(res, {
            httpStatusCode: status.NOT_FOUND,
            success: false,
            message: "Doctor not found"
        })
        return;
    }
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor retrieved successfully",
        data: doctor
    })
})


export const DoctorController = {
    getAllDoctors,
    updateDoctor,
    deleteDoctor,
    getDoctorById
}