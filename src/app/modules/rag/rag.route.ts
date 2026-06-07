import { Router } from "express";
import { RagController } from "./rag.controller";

const ragRouter = Router();

ragRouter.get("/stats", RagController.getStats);
//index doctor data
ragRouter.post("/ingest-doctors", RagController.ingestDoctor)

// query
ragRouter.post("/query", RagController.queryRag);
export const RagRouter = ragRouter;