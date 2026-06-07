import { Prisma } from "../../../generated/prisma/client";
import prisma from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service";

const toVectorLiteral = (vector:number[]) => `[${vector.join(",")}]`;

export class IndexingService {
    private embeddingService: EmbeddingService;
    constructor(){
        this.embeddingService = new EmbeddingService();
    }
    async indexDoctorsData(){
        try {
            console.log("Fetching doctors data from database...");
            const doctors = await prisma.doctor.findMany({
                where: {
                    isDeleted:false,
                },
                include: {
                    specialties: {
                        include: {
                            specialty: true,
                        }
                    },
                    reviews: true,
                }
            });
            let indexedCount = 0;
            for(const doctor of doctors){
                // Format specialties as comma separated string
                const specialtiesList = doctor.specialties.map(ds => ds.specialty.title).join(",");
            
                // Format reviews as comma separated string
                const reviewsText = doctor.reviews.map(r => `- Rating: ${r.rating}/5, Comment: ${r.comment}||"No Comment"`);
                
                const content = `
                Doctor Name: ${doctor.name}
                Qualifications: ${doctor.qualification}
                Designation: ${doctor.designation}
                Appointment Fee: ${doctor.appointmentFee}
                Current Working Place: ${doctor.currentWorkingPlace}
                Average Rating: ${doctor.averageRating}
                Specialties: ${specialtiesList || "No Specialties"}
                Reviews: ${reviewsText || "No Reviews"}
                `
                const  metadata = {
                    doctorId: doctor.id,
                    name: doctor.name,
                    specialties: doctor.specialties.map(ds => ds.specialty.title),
                    averageRating: doctor.averageRating,
                    experience: doctor.experience,
                }
                const chunkKey = `doctor-${doctor.id}`;
                await this.indexDocument(
                    chunkKey,
                    "Doctor",
                    doctor.id,
                    content, 
                    doctor.name,
                    metadata    
                )
                indexedCount++;
            }

            console.log(`Successfully indexed ${indexedCount} doctors data.`);

        } catch (error) {
            console.log("Error indexing doctors data: ", error);
            throw new Error("Error indexing doctors data: " + (error as Error).message);
        }
    }

    async indexDocument(
        chunkKey: string,
        sourceType: string, 
        sourceId: string, 
        content: string, 
        sourceLabel?:string, 
        metadata?: Record<string, unknown>
    ){
        try {
            const embedding = await this.embeddingService.generateEmbedding(content);
            const vectorLiteral = toVectorLiteral(embedding);

            await prisma.$executeRaw(Prisma.sql`
                INSERT INTO document_embeddings (
                    "id",
                    "chunkKey",
                    "sourceType",
                    "sourceId",
                    "sourceLabel",
                    "content",
                    "metadata",
                    "embedding",
                    "updatedAt"
                )
                VALUES(
                    ${Prisma.raw("gen_random_uuid()")},
                    ${chunkKey},
                    ${sourceType},
                    ${sourceId},
                    ${sourceLabel||null},
                    ${content},
                    ${JSON.stringify(metadata)},
                    CAST(${vectorLiteral} AS VECTOR),
                    NOW()
                )
                ON CONFLICT ("chunkKey") DO UPDATE SET
                "sourceType" = EXCLUDED."sourceType",
                "sourceId" = EXCLUDED."sourceId",
                "sourceLabel" = EXCLUDED."sourceLabel",
                "content" = EXCLUDED."content",
                "metadata" = EXCLUDED."metadata",
                "embedding" = EXCLUDED."embedding",
                "isDeleted" = false,
                "deletedAt" = null,
                "updatedAt" = NOW()                `
            )
        } catch (error) {
            console.log("Error indexing document: ", error);
            throw new Error("Error indexing document: " + (error as Error).message);
        }
    }
}