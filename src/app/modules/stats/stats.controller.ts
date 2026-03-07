import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { StatsService } from "./stats.service";
import { sendResponse } from "../../helpers/sendResponse";
import status from "http-status";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await StatsService.getDashboardStats(user);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Dashboard stats retrieved successfully",
        data: result,
    })
})

export const StatsController = {
    getDashboardStats,
}