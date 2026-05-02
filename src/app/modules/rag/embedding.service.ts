import { env } from "../../../config/env";



export class EmbeddingService {
    private apikey: string;
    private apiUrl: string = "https://openrouter.ai/api/v1/embeddings";
    private embeddingModel: string;
    constructor(){
        this.apikey = env.RAG.OPENROUTER_API_KEY || "";
        this.embeddingModel = env.RAG.OPENROUTER_EMBEDDING_MODEL || "nvidia/llama-nemotron-embed-vl-1b-v2:free";
        if(!this.apikey) {
            throw new Error("OpenRouter API key is required for EmbeddingService");
        }
    }

    async generateEmbedding(text:string){
        try {
            const response = await fetch(`this.apiUrl/embeddings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer '+this.apikey,
                },
                body: JSON.stringify({
                    model: this.embeddingModel,
                    input: text,
                }),
            });

            if(!response.ok){
                const errorData = await response.json();
                console.log("Error response from OpenRouter: ", errorData);
                throw new Error(`Failed to generate embedding: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            if(!data.data || data.data.length == 0) {
                throw new Error("Failed to generate embedding: No data returned");
            }
            return data.data[0].embedding;
            
        } catch (error) {
            console.log("Error generating embedding: ", error);
            throw new Error("Error generating embedding: " + (error as Error).message);
        }
    }
}   