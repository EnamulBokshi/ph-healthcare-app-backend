import { Prisma } from "../../../generated/prisma/client";
import prisma from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service";
import { IndexingService } from "./indexing.service";
import { LLMService } from "./llm.service";

export class RagService {
        private embeddingService: EmbeddingService;
        private llmService: LLMService;
        private indexingService: IndexingService;
        constructor(){
                this.embeddingService = new EmbeddingService();
                this.indexingService = new IndexingService();
                this.llmService = new LLMService();

        }

        async ingestDoctorData (){
                return this.indexingService.indexDoctorsData()
        }

        async generateAnswer(query: string, limit:number = 5, sourceType?:string, asJson:boolean = false){
                try {
                        // 1. Generate embedding for the query
                        const relevantDocs = await this.retrieveRelevantDocuments(query, limit,sourceType);   
                        // extract content from documents for context
                        const context = (relevantDocs as any).filter((doc:any)=>doc.content).map((doc:any)=> doc.content);

                        let answer = await this.llmService.generateResponse(query, context, asJson);
                        let parsedAnswer:any= answer;
                        if(asJson){
                                try {
                                        if(answer.startsWith("```json")){
                                                answer = answer.replace(/```json/g, "").replace(/```/g, "").trim();
                                        }
                                        else if(answer.startsWith("```")){
                                                answer = answer.replace(/```/g, "").trim();
                                        }
                                        parsedAnswer = JSON.parse(answer);
                                        
                                } catch (error) {
                                        console.error("Error parsing LLM response as JSON:", error);
                                        throw new Error("Failed to parse LLM response as JSON");
                                }
                        }
                        return {
                                answer: parsedAnswer,
                                sources: (relevantDocs as any).map((doc:any)=>({
                                        id: doc.id,
                                        chunkKey: doc.chunkKey,
                                        sourceType: doc.sourceType,
                                        sourceId: doc.sourceId,
                                        sourceLabel: doc.sourceLabel,
                                        content: doc.content,
                                        similarity: doc.similarity,
                                })),
                                contextUsed: context.length > 0,
                        };
                } catch (error) {
                        console.error("Error in generateAnswer:", error);
                        throw error;
                }
        }
        async retrieveRelevantDocuments(query: string, limit:number, sourceType?:string){
                try {
                        const queryEmbedding = await this.embeddingService.generateEmbedding(query);
                        // For simplicity, we are not implementing actual vector search here.
                        // In a real implementation, you would query your vector database with the query embedding to retrieve relevant documents.
                        const vectorLiteral = `[${queryEmbedding.join(", ")}]`;
                        const results = await prisma.$queryRaw(Prisma.sql`
                                SELECT id, "chunkKey", "sourceType", "sourceId", "sourceLabel", content, metadata, embedding, "isDeleted", "deletedAt", "createdAt", "updatedAt", 1 - (embedding <=> CAST(${vectorLiteral} AS vector)) AS similarity
                                FROM "document_embeddings"
                                WHERE "isDeleted" = false
                                ${sourceType ? Prisma.sql`AND "sourceType" = ${sourceType}` : Prisma.empty}
                                -- ORDER BY similarity DESC
                                ORDER BY embedding <=> CAST(${vectorLiteral} AS vector)
                                LIMIT ${limit}
                                `)
                        
                        // return [
                        //         {
                        //                 id: "doc1",
                        //                 content: "This is a relevant document about healthcare.",
                        //                 sourceType: "doctor",
                        //                 sourceId: "doc123",
                        //                 metadata: {}
                        //         },
                        //         {
                        //                 id: "doc2",
                        //                 content: "This document contains information about medical treatments.",
                        //                 sourceType: "article",
                        //                 sourceId: "art456",
                        //                 metadata: {}
                        //         }
                        // ].filter(doc => !sourceType || doc.sourceType === sourceType).slice(0, limit);
                return results;
                } catch (error) {
                        console.error("Error in retrieveRelevantDocuments:", error);
                        throw error;
                }
        }

        async getStats(){
        try {
                const totalDcuments = await prisma.$queryRaw(Prisma.sql`
                        SELECT COUNT(*) FROM "document_embeddings" WHERE "isDeleted" = false
                `);
                const sourceTypeCounts = await prisma.$queryRaw(Prisma.sql`
                        SELECT "sourceType", COUNT(*) FROM "document_embeddings" WHERE "isDeleted" = false GROUP BY "sourceType"
                `);
                const normalizeCount = (value: unknown) => {
                        if (typeof value === "bigint") {
                                return Number(value);
                        }
                        if (typeof value === "string") {
                                return Number.parseInt(value, 10);
                        }
                        if (typeof value === "number") {
                                return value;
                        }
                        return 0;
                };
                return {
                        totalActiveDocuments: normalizeCount((totalDcuments as any)[0]?.count),
                        sourceTypeCounts: (sourceTypeCounts as any).reduce((acc:any, curr:any) => {
                                acc[curr.sourceType] = normalizeCount(curr.count);
                                return acc;
                        }, {}),
                        timeStamp:new Date(),
                };
                
        } catch (error) {
                console.error("Error in getStats:", error);
                throw error;
        }
        }
        
}