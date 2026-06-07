import { content } from "pdfkit/js/page";
import { env } from "../../../config/env";

export class LLMService {
  private apikey: string;
  private apiUrl: string = "https://openrouter.ai/api/v1";
  private model: string;

  constructor() {
    this.apikey = env.RAG.OPENROUTER_API_KEY || "";
    this.model = env.RAG.OPENROUTER_LLM_MODEL;
    if (!this.apikey || !this.model) {
      throw Error("LLM api key and model are missing!!");
    }
  }

  async generateResponse(
    prompt: string,
    context: string[] = [],
    asJson: boolean = false,
  ) {
    try {
        let fullPrompt = context.length > 0 ? `Context information: \n${context.join("\n\n")}\n\nQuestion: ${prompt}\n\nAnswer based on the context above.` : prompt;
        if(asJson){
            fullPrompt += `\n\nReturn Only a valid JSON object matcing this structure: {"doctors":[{"name":"Doctor Name", "reason":"why they are suitable", "specialty":"Their specialty"}]}. Do not include any markdown formatting.`
        }

        const systemPrompt = asJson ? 
        "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. You must respond with only valid JSON format. Do not include markdown tags."
        : 
        "You are a helpful assistant for a healthcare management system. Answer questions based on the provided context. If the context doesn't contain the answer, say you don't have enough information."
    
        const bodyPayload: any = {
            model: this.model,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: fullPrompt,
                }
            ],
            temperature: 0.1,
            max_token: 1500,
        };

        if(asJson && (this.model.includes("gpt") || this.model.includes("openai"))){
            bodyPayload.response_format = {type: "json_object"}
        }
        const response = await fetch(`${this.apiUrl}/chat/completions`, {
            method:"POST",
            headers: {
                Authorization: `Bearer ${this.apikey}`,
                "Content-Type": "application/json",
                "HTTP-Referer":"https://healthcare-management.local",
                "X-Title":"Healthcare Management System",
            },
            body:JSON.stringify(bodyPayload)
        });
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message} || "unknown error"`)
        }
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
