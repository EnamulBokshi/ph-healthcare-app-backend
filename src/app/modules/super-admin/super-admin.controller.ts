import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { SuperAdminService } from "./super-admin.service";
import { sendResponse } from "../../helpers/sendResponse";
import status from "http-status";
import { IUpdateAdminPayload } from "./super-admin.interface";

const getAllSuperAdmin = catchAsync(async(req: Request, res: Response) => {

    const admins = await SuperAdminService.getAllSuperAdmin();

    if(!admins) {
        return sendResponse(res, {
            success: false,
            httpStatusCode: status.NOT_FOUND,
            message: "No admins found"
        });
    }
    

    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Admins retrieved successfully",
        data: admins
    });
});


const getSuperAdminById = catchAsync(async(req: Request, res: Response) => {
    const {superAdminId} = req.params;
    if(!superAdminId) {
        return sendResponse(res, {
            success: false,
            httpStatusCode: status.BAD_REQUEST,
            message: "Super admin id is required"
        });
    }
    const superAdmin = await SuperAdminService.getSuperAdminById(superAdminId as string );;
    if(!superAdmin) {
        return sendResponse(res, {
            success: false,
            httpStatusCode: status.NOT_FOUND,
            message: "Super admin not found"
        });
    }
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Super admin retrieved successfully",
        data: superAdmin
    });
});


const deleteSuperAdmin = catchAsync(async(req: Request, res: Response) => { 
    const {superAdminId} = req.params;
    if(!superAdminId) {
        return sendResponse(res, {
            success: false,
            httpStatusCode: status.BAD_REQUEST,
            message: "Super admin id is required"
        });
    }
    const user = req.user;
    const result = await SuperAdminService.deleteSuperAdmin(superAdminId as string, user);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: result.message || "Super admin deleted successfully",
    });
})

const updateSuperAdmin = catchAsync(async(req: Request, res: Response) => {
    const {superAdminId} = req.params;
    const payload:IUpdateAdminPayload = req.body;
    if(!superAdminId) {
        return sendResponse(res, {
            httpStatusCode: status.BAD_REQUEST,
            success: false,
            message: "Super admin id is required"
        });
    }
    // const superAdmin = await SuperAdminService.getSuperAdminById(superAdminId as string);
    // if(!superAdmin) {
    //     return sendResponse(res, {
    //         httpStatusCode: status.NOT_FOUND,
    //         success: false,
    //         message: "Super admin not found"
    //     });
       
    // }
    const updatedSuperAdmin = await SuperAdminService.updateSuperAdmin(superAdminId as string, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Super admin updated successfully",
        data: updatedSuperAdmin
    })
})

export const SuperAdminController = {
    getAllSuperAdmin,
    getSuperAdminById,
    deleteSuperAdmin,
    updateSuperAdmin
}