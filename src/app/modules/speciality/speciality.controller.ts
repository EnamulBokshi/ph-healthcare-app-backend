import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";
import catchAsync from "../../helpers/catchAsync";
import { sendResponse } from "../../helpers/sendResponse";



const createSpeciality = catchAsync( async(req: Request, res: Response)=> {
     const payload = req.body;
        const speciality = await SpecialityService.createSpeciality(payload);
        sendResponse(res, {
            httpStatusCode: 201,
            success: true,
            data: speciality,
            message: "Speciality created successfully"
        })
})

const getAllSpecialities = catchAsync(
    async (
        req:Request,
        res:Response
    ) => {
        const specialities = await SpecialityService.getAllSpecialities();
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            data: specialities,
            message: "Specialities retrieved successfully"
        })
    }
)


const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
     const specialityId = req.params.specialityId;
        if(!specialityId){
            return res.status(400).json({
                success: false,
                data: null,
                error: "Speciality ID is required",
                message: "Failed to delete speciality"
            })
        }
        const speciality = await SpecialityService.deleteSpeciality(specialityId as string)
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            data: speciality,
            message: "Speciality deleted successfully"
        })
})

const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
     const specialityId = req.params.specialityId;

        if(!specialityId){
            return res.status(400).json({
                success: false,
                data: null,
                error: "Speciality ID is required",
                message: "Failed to update speciality"
            })
        }
         
        const payload = req.body;
        const speciality = await SpecialityService.updateSpeciality(specialityId as string, payload);
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            data: speciality,
            message: "Speciality updated successfully"
        })
})

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality
}