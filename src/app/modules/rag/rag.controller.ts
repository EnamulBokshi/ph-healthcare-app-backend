import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { sendResponse } from "../../helpers/sendResponse";
import { RagService } from "./rag.service";
import status from "http-status";
import { redisService } from "../../lib/radis";

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
    
    //Generate a cache key from the query

    const cacheKey = `rag:qeuery:${query}:${limit??5}:${sourceType??"all"}`;

    try {
        const cachedResult = await redisService.get(cacheKey);
        if(cachedResult){
            console.log("Cache hit for key:", cacheKey);
            sendResponse(res,{
                success: true,
                message: "Query result from cache",
                data: JSON.parse(cachedResult),
                httpStatusCode: status.OK
            })
            return;
        }
    } catch (error) {
        console.error("Error occurred while fetching cached data for key:", cacheKey, error);
    }



    // cache-MISS

    
    const result = await ragService.generateAnswer(query, limit, sourceType, true );
    sendResponse(res, {
        success: true,
        message: "Query result",
        data: result,
        httpStatusCode: status.OK
    });

    try {
        // redisService.set expects a string value; store JSON stringified result
        await redisService.set(cacheKey, JSON.stringify(result), 600);

    } catch (error) {
        console.warn("Error occurred while setting cache for key:", cacheKey, error);
    }
})

export const RagController = {
    getStats,
    ingestDoctor,
    queryRag

}