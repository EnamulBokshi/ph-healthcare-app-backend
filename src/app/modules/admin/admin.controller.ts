import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { AdminService } from "./admin.service";
import { sendResponse } from "../../helpers/sendResponse";
import status from "http-status";
import { IChangeUserRolePayload, IChangeUserStatusPayload, IUpdateAdminPayload } from "./admin.interface";

const getAllAdmin = catchAsync(async(req: Request, res: Response) => {

    const admins = await AdminService.getAllAdmin();

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


const getAdminById = catchAsync(async(req: Request, res: Response) => {
    const {adminId} = req.params;
    if(!adminId) {
        return sendResponse(res, {
            success: false,
            httpStatusCode: status.BAD_REQUEST,
            message: "Admin id is required"
        });
    }
    const admin = await AdminService.getAdminById(adminId as string );;
    if(!admin) {
        return sendResponse(res, {
            success: false,
            httpStatusCode: status.NOT_FOUND,
            message: "Admin not found"
        });
    }
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Admin retrieved successfully",
        data: admin
    });
});


const deleteAdmin = catchAsync(async(req: Request, res: Response) => {
    const {adminId} = req.params;
    if(!adminId) {
        return sendResponse(res, {
            success: false,
            httpStatusCode: status.BAD_REQUEST,
            message: "Admin id is required"
        });
    }
    const user = req.user;
    const result = await AdminService.deleteAdmin(adminId as string, user);
    if(!result) {
        return sendResponse(res, {
            success: false,
            httpStatusCode: status.NOT_FOUND,
            message: "Admin not found"
        });
    } 

    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Admin deleted successfully",
        
    });
})

const updateAdmin = catchAsync(async(req: Request, res: Response) => {
    const {adminId} = req.params;
    const payload:IUpdateAdminPayload = req.body;
    if(!adminId) {
        return sendResponse(res, {
            httpStatusCode: status.BAD_REQUEST,
            success: false,
            message: "Admin id is required"
        });
    }
    // const admin = await AdminService.getAdminById(adminId as string);
    // if(!admin) {
    //     return sendResponse(res, {
    //         httpStatusCode: status.NOT_FOUND,
    //         success: false,
    //         message: "Admin not found"
    //     });
       
    // }
    const updatedAdmin = await AdminService.updateAdmin(adminId as string, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin updated successfully",
        data: updatedAdmin
    })
})


const changeUserStatus = catchAsync(async(req: Request, res: Response) => {
    const user = req.user;
    const payload: IChangeUserStatusPayload = req.body;
    const result = await AdminService.changeUserStatus(user, payload);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User status changed successfully",
        data: result
    });
})

const changeUserRole = catchAsync(async(req: Request, res: Response) => {
    const user = req.user;
    const payload: IChangeUserRolePayload = req.body;
    const result = await AdminService.changeUserRole(user, payload);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User role changed successfully",
        data: result
    });
})


export const AdminController = {
    getAllAdmin,
    getAdminById,
    deleteAdmin,
    updateAdmin,
    changeUserStatus,
    changeUserRole
}