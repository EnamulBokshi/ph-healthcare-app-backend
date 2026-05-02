import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { sendResponse } from "../../helpers/sendResponse";
import { RagService } from "./rag.service";
import status from "http-status";

const ragService = new RagService();


const getStats = catchAsync(async(req: Request, res: Response) => {
    sendResponse(res, {
        success: true,
        message: "Stats retrieved successfully",
        data: {
            totalDocuments: 100,
            totalTokens: 5000,
        },
        httpStatusCode: 200,
    })
})

const ingestDoctor = catchAsync(async(req: Request, res: Response) => {
    const result = await ragService.ingestDoctorData();
    sendResponse(res, {
        success: true,
        message: "Doctor ingest data",
        data: result,
        httpStatusCode: status.OK
    })

})

export const RagController = {
    getStats,
    ingestDoctor
}