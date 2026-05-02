import { EmbeddingService } from "./embedding.service";
import { IndexingService } from "./indexing.service";

export class RagService {
        private embeddingService: EmbeddingService;
        // private llmService: LLMService;
        private indexingService: IndexingService;
        constructor(){
                this.embeddingService = new EmbeddingService();
                this.indexingService = new IndexingService();

        }

        async ingestDoctorData (){
                return this.indexingService.indexDoctorsData()
        }
        
}