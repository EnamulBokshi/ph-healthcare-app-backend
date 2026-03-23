import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { sendResponse } from "../../helpers/sendResponse";
import { SpecialtyService } from "./specialty.service";



const createSpecialty = catchAsync( async(req: Request, res: Response)=> {
     const payload = req.body;
    console.log("reqeust body", req.body);
    const filePath = req.file?.path;

        const specialty = await SpecialtyService.createSpecialty({...payload,icon:filePath}, );
        sendResponse(res, {
            httpStatusCode: 201,
            success: true,
            data: specialty,
            message: "Specialty created successfully"
        })
})

const getAllSpecialties = catchAsync(
    async (
        req:Request,
        res:Response
    ) => {
        const specialties = await SpecialtyService.getAllSpecialties();
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            data: specialties,
            message: "Specialties retrieved successfully"
        })
    }
)


const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
     const specialtyId = req.params.specialtyId;
        if(!specialtyId){
            return res.status(400).json({
                success: false,
                data: null,
                error: "Specialty ID is required",
                message: "Failed to delete specialty"
            })
        }
        const specialty = await SpecialtyService.deleteSpecialty(specialtyId as string)
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            data: specialty,
            message: "Specialty deleted successfully"
        })
})

const updateSpecialty = catchAsync(async (req: Request, res: Response) => {
     const specialtyId = req.params.specialtyId;

        if(!specialtyId){
            return res.status(400).json({
                success: false,
                data: null,
                error: "Specialty ID is required",
                message: "Failed to update specialty"
            })
        }
         
        const payload = req.body;
        const specialty = await SpecialtyService.updateSpecialty(specialtyId as string, payload);
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            data: specialty,
            message: "Specialty updated successfully"
        })
})

export const SpecialtyController = {
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty,
    updateSpecialty
}