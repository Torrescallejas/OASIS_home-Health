import OpenAI from "openai";
import fs from "fs";
export class OpenAIService {
    private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    async transcribe(filePath: string): Promise<string> {
        const resp = await this.client.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
            // "text" ya es el formato por defecto → no hace falta response_format
        });

        // Puede venir undefined si Whisper falla
        return resp.text ?? "";
    }

    async extractOasis(transcript: string) {
        const fn = {
            name: "oasis_g",
            description: "Extrae M1800–M1860 y un resumen",
            parameters: {
                type: "object",
                properties: {
                    m1800: { type: "integer" },
                    m1810: { type: "integer" },
                    m1820: { type: "integer" },
                    m1830: { type: "integer" },
                    m1840: { type: "integer" },
                    m1850: { type: "integer" },
                    m1860: { type: "integer" },
                    summary: { type: "string" }
                },
                required: ["m1800", "m1810", "m1820", "m1830", "m1840", "m1850", "m1860", "summary"]
            }
        };

        const chat = await this.client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Eres un experto en codificación OASIS G." },
                { role: "user", content: transcript }
            ],
            functions: [fn],
            function_call: { name: "oasis_g" }
        });

        return JSON.parse(chat.choices[0].message.function_call!.arguments);
    }
}
