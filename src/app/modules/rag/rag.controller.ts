import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { sendResponse } from "../../helpers/sendResponse";
import { RagService } from "./rag.service";
import status from "http-status";

const ragService = new RagService();


const getStats = catchAsync(async(req: Request, res: Response) => {
    const result = await ragService.getStats();
    sendResponse(res, {
        success: true,
        message: "Stats retrieved successfully",
        data: result,
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

const queryRag = catchAsync(async(req: Request, res: Response) => {
    const { query, limit, sourceType } = req.body;
    if(!query){
        return sendResponse(res, {
            success: false,
            message: "Query is required",
            httpStatusCode: status.BAD_REQUEST
        })
    }
    
    const result = await ragService.generateAnswer(query, limit, sourceType, true );
    sendResponse(res, {
        success: true,
        message: "Query result",
        data: result,
        httpStatusCode: status.OK
    })
})

export const RagController = {
    getStats,
    ingestDoctor,
    queryRag

}