import { Router } from "express";
import { RagController } from "./rag.controller";

const ragRouter = Router();

ragRouter.get("/stats", RagController.getStats);
ragRouter.post("/ingest-doctors", RagController.ingestDoctor)
export const RagRouter = ragRouter;